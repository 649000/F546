/**
 * Created by Nazri on 4/8/16.
 */

//This traceroute graphs shows duplicated paths
angular.module('traceroute').controller('TracerouteGraphCtrl', ['$scope', '$http', '$q', '$log', 'HostService', 'TracerouteGraphService', 'UnixTimeConverterService', 'GeoIPNekudoService', function ($scope, $http, $q, $log, HostService, TracerouteGraphService, UnixTimeConverterService, GeoIPNekudoService) {

  $log.debug("TracerouteGraphCtrl: START")

  var host = HostService.getHost();
  var sourceAndDestinationList;
  var nodeList;

  TracerouteGraphService.getMainTracerouteResult(
    {
      'format': 'json',
      'event-type': 'packet-trace',
      'limit': 10,
      // 'time-end': (Math.floor(Date.now() / 1000)),
      'time-range': 86400
    }
  ).then(function (response) {

    sourceAndDestinationList = [];
    nodeList = [];
    var promises = [];

    for (var i = 0; i < response.data.length; i++) {

      // $log.info("Initial Source Name: " + response.data[i]['source'])
      sourceAndDestinationList.push(
        {
          source: response.data[i]['source'],
          destination: response.data[i]['destination'],
          metadataKey: response.data[i]['metadata-key']
        }
      );


      //Adding main nodes into graph
      if (TracerouteGraphService.getGraph().elements('node[id = "' + response.data[i]['source'] + '"]').size() == 0) {

        // True as this is a SOURCE node.
        TracerouteGraphService.add_node(response.data[i]['source'], true);
        nodeList.push(response.data[i]['source']);

        // Event
        TracerouteGraphService.getGraph().on('tap', 'node[id = "' + response.data[i]['source'] + '"]', function (event) {
          var element = event.cyTarget;
          $log.debug("Clicked on Node ID: " + element.data().id)

        });
      }

      for (var j = 0; j < response.data[i]['event-types'].length; j++) {
        if (response.data[i]['event-types'][j]['event-type'] == 'packet-trace') {

          promises.push(TracerouteGraphService.getIndividualTracerouteResult(response.data[i]['url'],
            {
              'format': 'json',
              // 'limit': '2',
              // 'time-end': (Math.floor(Date.now() / 1000)),
              'time-range': 86400
              // 48 Hours = 172800
              // 24 hours = 86400
            }
          ));

        }
      }


    }

    // $log.debug("sourceAndDestinationList Size: " + sourceAndDestinationList.length)
    return $q.all(promises);

  }).then(function (response) {

    $log.debug("TracerouteGraphCtrl:getIndividualTracerouteResult().response.length: " + response.length);

    for (var i = 0; i < response.length; i++) {

      var reversedResponse = response[i].data.reverse();

      var startNode = sourceAndDestinationList[i].source;
      var destinationNode = sourceAndDestinationList[i].destination;
      var metadataKey = sourceAndDestinationList[i].metadataKey;
      var errorInTraceroute = null;


      for (var j = 0; j < reversedResponse.length; j++) {

        // $log.debug("reversedResponse Length: " + reversedResponse.length)
        // $log.debug("ts : " + reversedResponse[j]['ts'])

        // $scope.tracerouteTime = UnixTimeConverterService.getDate(reversedResponse[j]['ts']);
        // $scope.tracerouteDate = UnixTimeConverterService.getTime(reversedResponse[j]['ts']);

        // IP keeps appending and adding inside, without checking if it's unique. Unique at per iteration.
        var temp_ip = [];
        var temp_rtt = [];
        var tempResultList = [];

        for (var k = 0; k < reversedResponse[j]['val'].length; k++) {

          if (reversedResponse[j]['val'][k]['success'] == 1) {

            if (reversedResponse[j]['val'][k]['query'] == 1) {

              tempResultList.push({
                ip: reversedResponse[j]['val'][k]['ip'],
                rtt: reversedResponse[j]['val'][k]['rtt']
              })

              temp_ip.push(reversedResponse[j]['val'][k]['ip']);
              temp_rtt.push(reversedResponse[j]['val'][k]['rtt']);
            }
          } else {
            errorInTraceroute = true;


          }

        }

        // Adding Nodes/ CHECK FOR ERROR too.
        for (var m = 0; m < tempResultList.length; m++) {

          if (TracerouteGraphService.getGraph().elements('node[id = "' + tempResultList[m].ip + '"]').size() == 0) {

            TracerouteGraphService.add_node(tempResultList[m].ip, false);
            nodeList.push(tempResultList[m].ip);

            TracerouteGraphService.getGraph().on('tap', 'node[id = "' + tempResultList[m].ip + '"]', function (event) {


            })
          }

        }

        // Adding edges, highlight error in traceroute if needed

        for (var m = 0; m < tempResultList.length; m++) {
          if (m != (tempResultList.length - 1 )) {

            // var edgeID = temp_ip[m] + "to" + temp_ip[m + 1];
            var edgeID = Math.random();

            if (TracerouteGraphService.getGraph().elements('edge[id = "' + edgeID + '"]').size() == 0) {

              TracerouteGraphService.add_edge(edgeID, temp_ip[m], temp_ip[m + 1], temp_rtt[m], null, null, startNode, destinationNode, metadataKey);

              TracerouteGraphService.getGraph().on('tap', 'edge[id = "' + edgeID + '"]', function (event) {
                var element = event.cyTarget;
                //ID: element.id()
                //metadataKey: element.data().metadataKey


                // search for ALL edges with same metadata, make it red, make everything else the same.
                TracerouteGraphService.getGraph().style().selector("edge").style({
                  'line-color': '#a8ea00',
                  'width': 2
                }).update();

                TracerouteGraphService.getGraph().style()
                // .selector('#203.30.39.127')
                // .selector(':selected')
                // .selector('[id = "203.30.39.127"]')
                  .selector('edge[metadataKey = "' + element.data().metadataKey + '"]')
                  .style({
                    'line-color': 'green',
                    'width': 4
                  }).update();


              });

            }
          }
        }


        // Add Edge for main node
        // var edgeID = startNode + "to" + reversedResponse[j]['val'][0]['ip'];
        var edgeID = Math.random();

        if (TracerouteGraphService.getGraph().elements('edge[id = "' + edgeID + '"]').size() == 0) {

          TracerouteGraphService.add_edge(edgeID, startNode, reversedResponse[j]['val'][0]['ip'], temp_rtt[m], null, null, startNode, destinationNode, metadataKey);

          TracerouteGraphService.getGraph().on('tap', 'edge[id = "' + edgeID + '"]', function (event) {
            var element = event.cyTarget;
            $log.debug("Element METADATA: " + element.data().metadataKey)
            TracerouteGraphService.getGraph().style().selector("edge").style({
              'line-color': '#a8ea00',
              'width': 2
            }).update();

            TracerouteGraphService.getGraph().style()
            // .selector('#203.30.39.127')
            // .selector(':selected')
            // .selector('[id = "203.30.39.127"]')
              .selector('edge[metadataKey = "' + element.data().metadataKey + '"]')
              .style({
                'line-color': 'green',
                'width': 4
              }).update();


          });
        }

        // Break so that we grab only the latest traceroute path
        break;
      }

    }


    var nodeToIP_promises = [];
    for (var i = 0; i < nodeList.length; i++) {
      nodeToIP_promises.push(GeoIPNekudoService.getCountry(nodeList[i]));
    }

    return $q.all(nodeToIP_promises);

  }).then(function (response) {

    for (var i = 0; i < response.length; i++) {


      // ('[id = "203.30.39.127"]')
      var node = TracerouteGraphService.getGraph().elements('[id = "' + response[i].ip + '"]');
      node.data({
        label: response[i].ip + "\n" + response[i].city + ", " + response[i].countrycode
      });


    }

    //Style Options
    TracerouteGraphService.getGraph().style()
      .selector('node[sourceNode = "true"]')
      .style({
        'background-color': 'black'
      }).update();

    var layoutOptions = {
      name: 'breadthfirst',
      fit: true, // whether to fit the viewport to the graph
      directed: false, // whether the tree is directed downwards (or edges can point in any direction if false)
      padding: 30, // padding on fit
      circle: false, // put depths in concentric circles if true, put depths top down if false
      spacingFactor: 1.75, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
      boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
      avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
      roots: undefined, // the roots of the trees
      maximalAdjustments: 0, // how many times to try to position the nodes in a maximal way (i.e. no backtracking)
      animate: false, // whether to transition the node positions
      animationDuration: 500, // duration of animation in ms if enabled
      animationEasing: undefined, // easing of animation if enabled
      ready: undefined, // callback on layoutready
      stop: undefined // callback on layoutstop
    };

    TracerouteGraphService.getGraph().layout(layoutOptions);


  }).catch(function (error) {
    $log.debug("TracerouteController:bw_cytoscape")
    $log.debug("Server Response: " + error.status);

  });


}]);


angular.module('traceroute').controller('TracerouteTableCtrl', ['$scope', '$http', '$q', '$log', 'HostService', 'TracerouteGraphService', 'UnixTimeConverterService', 'GeoIPNekudoService', 'AnalyzeTraceroute', 'UniqueArrayService', function ($scope, $http, $q, $log, HostService, TracerouteGraphService, UnixTimeConverterService, GeoIPNekudoService, AnalyzeTraceroute, UniqueArrayService) {

  $log.debug("TracerouteTableCtrl: START");

  var sourceAndDestinationList;
  var nodeList;

  $scope.tracerouteResults = [];


  TracerouteGraphService.getMainTracerouteResult(
    {
      'format': 'json',
      'event-type': 'packet-trace',
      'limit': 10,
      // 'time-end': (Math.floor(Date.now() / 1000)),
      'time-range': 86400
      // 48 Hours = 172800
      // 24 hours = 86400
    }
  ).then(function (response) {

    sourceAndDestinationList = [];
    nodeList = [];
    var promises = [];

    for (var i = 0; i < response.data.length; i++) {

      sourceAndDestinationList.push(
        {
          source: response.data[i]['source'],
          destination: response.data[i]['destination'],
          metadataKey: response.data[i]['metadata-key']
        }
      );

      nodeList.push(response.data[i]['source']);

      for (var j = 0; j < response.data[i]['event-types'].length; j++) {
        if (response.data[i]['event-types'][j]['event-type'] == 'packet-trace') {

          promises.push(TracerouteGraphService.getIndividualTracerouteResult(response.data[i]['url'],
            {
              'format': 'json',
              // 'limit': '2',
              // 'time-end': (Math.floor(Date.now() / 1000)),
              'time-range': 86400
              // 48 Hours = 172800
              // 24 hours = 86400
            }
          ));

        }
      }

    }

    var uniqueNodes = UniqueArrayService.getUnique(nodeList);
    $scope.noOfSourceNodes = uniqueNodes.length;

    // $log.debug("sourceAndDestinationList Size: " + sourceAndDestinationList.length)
    return $q.all(promises);

  }).then(function (response) {

    // $log.debug("TracerouteTableCtrl:getIndividualTracerouteResult().response.length: " + response.length);

    for (var i = 0; i < response.length; i++) {

      var reversedResponse = response[i].data;

      var startNode = sourceAndDestinationList[i].source;
      var destinationNode = sourceAndDestinationList[i].destination;
      var metadataKey = sourceAndDestinationList[i].metadataKey;
      var aggregatedResults;
      var errorInTraceroute = null;

      // SOURCE
      // Array of results of the same source/destination.
      // Checking for 'active' servers

      if (reversedResponse.length > 1) {
        aggregatedResults = AnalyzeTraceroute.analyzeRtt(reversedResponse);
        // AnalyzeTraceroute.analyzeRtt();
      } else {
        // only 1 result available.
      }

      $scope.tracerouteResults.push({
        source: startNode,
        destination: destinationNode,
        nodes: aggregatedResults,
        metadata: metadataKey
      });

    }


    var noOfAnomalies = 0;
    $scope.anomalyResults = [];
    for (var i = 0; i < $scope.tracerouteResults.length; i++) {
      var anomaliesExist = false;

      for (var j = 0; j < $scope.tracerouteResults[i].nodes.length; j++) {
        if ($scope.tracerouteResults[i].nodes[j].status == true) {
          noOfAnomalies++;
          anomaliesExist = true;
        }
      }

      if (anomaliesExist == true) {
        $scope.anomalyResults.push($scope.tracerouteResults[i]);
      }


    }

    // $log.debug("sizeesee" + $scope.anomalyResults.length)
    // console.log("sizeesee" + $scope.anomalyResults.length)
    $scope.noOfAnomalies = noOfAnomalies;


    var nodeToIP_promises = [];
    for (var i = 0; i < nodeList.length; i++) {
      nodeToIP_promises.push(GeoIPNekudoService.getCountry(nodeList[i]));
    }

    return $q.all(nodeToIP_promises);

  }).then(function (response) {

    for (var i = 0; i < response.length; i++) {

      $scope.nodeLocation = {
        city: 1,
        country: 1
      };


      // ('[id = "203.30.39.127"]')
      var node = TracerouteGraphService.getGraph().elements('[id = "' + response[i].ip + '"]');

      node.data({
        label: response[i].ip + "\n" + response[i].city + ", " + response[i].countrycode
      });


    }


  }).catch(function (error) {
    $log.debug("TracerouteTableCtrl: Error")
    $log.debug(error)
    $log.debug("Server Response: " + error.status);

  });


}]);


angular.module('traceroute').controller('TracerouteNotificationCtrl', ['$scope', '$http', '$q', '$log', 'HostService', 'TracerouteGraphService', 'UnixTimeConverterService', 'GeoIPNekudoService', 'AnalyzeTraceroute', 'toastr', function ($scope, $http, $q, $log, HostService, TracerouteGraphService, UnixTimeConverterService, GeoIPNekudoService, AnalyzeTraceroute, toastr) {


  $scope.Hello = function () {

    $log.debug("HELLO")
    toastr.success('Buuussssukkk');

  }
}]);


angular.module('traceroute').controller('TracerouteGraphPanelCtrl', ['$scope', '$log', '$cacheFactory', 'TracerouteGraphService', function ($scope, $log, $cacheFactory, TracerouteGraphService) {

  $scope.layoutBreathFirst = function () {

    var options = {
      name: 'breadthfirst',

      fit: true, // whether to fit the viewport to the graph
      directed: false, // whether the tree is directed downwards (or edges can point in any direction if false)
      padding: 30, // padding on fit
      circle: false, // put depths in concentric circles if true, put depths top down if false
      spacingFactor: 1.75, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
      boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
      avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
      roots: undefined, // the roots of the trees
      maximalAdjustments: 0, // how many times to try to position the nodes in a maximal way (i.e. no backtracking)
      animate: false, // whether to transition the node positions
      animationDuration: 500, // duration of animation in ms if enabled
      animationEasing: undefined, // easing of animation if enabled
      ready: undefined, // callback on layoutready
      stop: undefined // callback on layoutstop
    };

    TracerouteGraphService.getGraph().layout(options);
  }

  $scope.layoutdisplayConcentric = function () {

    var options = {
      name: 'concentric',

      fit: true, // whether to fit the viewport to the graph
      padding: 30, // the padding on fit
      startAngle: 3 / 2 * Math.PI, // where nodes start in radians
      sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
      clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
      equidistant: false, // whether levels have an equal radial distance betwen them, may cause bounding box overflow
      minNodeSpacing: 10, // min spacing between outside of nodes (used for radius adjustment)
      boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
      avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
      height: undefined, // height of layout area (overrides container height)
      width: undefined, // width of layout area (overrides container width)
      concentric: function (node) { // returns numeric value for each node, placing higher nodes in levels towards the centre
        return node.degree();
      },
      levelWidth: function (nodes) { // the variation of concentric values in each level
        return nodes.maxDegree() / 4;
      },
      animate: false, // whether to transition the node positions
      animationDuration: 500, // duration of animation in ms if enabled
      animationEasing: undefined, // easing of animation if enabled
      ready: undefined, // callback on layoutready
      stop: undefined // callback on layoutstop
    };

    TracerouteGraphService.getGraph().layout(options);

  }

  $scope.layoutGrid = function () {
    var options = {
      name: 'grid',

      fit: true, // whether to fit the viewport to the graph
      padding: 30, // padding used on fit
      boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
      avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
      avoidOverlapPadding: 10, // extra spacing around nodes when avoidOverlap: true
      condense: false, // uses all available space on false, uses minimal space on true
      rows: undefined, // force num of rows in the grid
      cols: undefined, // force num of columns in the grid
      position: function (node) {
      }, // returns { row, col } for element
      sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
      animate: false, // whether to transition the node positions
      animationDuration: 500, // duration of animation in ms if enabled
      animationEasing: undefined, // easing of animation if enabled
      ready: undefined, // callback on layoutready
      stop: undefined // callback on layoutstop
    };

    TracerouteGraphService.getGraph().layout(options);

  }

  $scope.layoutCose = function () {

    var options = {
      name: 'cose',

      // Called on `layoutready`
      ready: function () {
      },

      // Called on `layoutstop`
      stop: function () {
      },

      // Whether to animate while running the layout
      animate: true,

      // The layout animates only after this many milliseconds
      // (prevents flashing on fast runs)
      animationThreshold: 250,

      // Number of iterations between consecutive screen positions update
      // (0 -> only updated on the end)
      refresh: 20,

      // Whether to fit the network view after when done
      fit: true,

      // Padding on fit
      padding: 30,

      // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
      boundingBox: undefined,

      // Extra spacing between components in non-compound graphs
      componentSpacing: 100,

      // Node repulsion (non overlapping) multiplier
      nodeRepulsion: function (node) {
        return 400000;
      },

      // Node repulsion (overlapping) multiplier
      nodeOverlap: 10,

      // Ideal edge (non nested) length
      idealEdgeLength: function (edge) {
        return 10;
      },

      // Divisor to compute edge forces
      edgeElasticity: function (edge) {
        return 100;
      },

      // Nesting factor (multiplier) to compute ideal edge length for nested edges
      nestingFactor: 5,

      // Gravity force (constant)
      gravity: 80,

      // Maximum number of iterations to perform
      numIter: 1000,

      // Initial temperature (maximum node displacement)
      initialTemp: 200,

      // Cooling factor (how the temperature is reduced between consecutive iterations
      coolingFactor: 0.95,

      // Lower temperature threshold (below this point the layout will end)
      minTemp: 1.0,

      // Whether to use threading to speed up the layout
      useMultitasking: true
    };

    TracerouteGraphService.getGraph().layout(options);

  }

  $scope.layoutCircle = function () {

    var options = {
      name: 'circle',

      fit: true, // whether to fit the viewport to the graph
      padding: 30, // the padding on fit
      boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
      avoidOverlap: true, // prevents node overlap, may overflow boundingBox and radius if not enough space
      radius: undefined, // the radius of the circle
      startAngle: 3 / 2 * Math.PI, // where nodes start in radians
      sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
      clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
      sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
      animate: false, // whether to transition the node positions
      animationDuration: 500, // duration of animation in ms if enabled
      animationEasing: undefined, // easing of animation if enabled
      ready: undefined, // callback on layoutready
      stop: undefined // callback on layoutstop
    };

    TracerouteGraphService.getGraph().layout(options);

  }

  $scope.clearCache = function () {
    $cacheFactory.get('$http').removeAll();

    //FIXME: Perhaps do a restart as well.
  }


}]);


//Empty Module

angular.module('traceroute').controller('XXX', ['$scope', '$http', '$q', '$log', 'HostService', 'TracerouteGraphService', 'UnixTimeConverterService', 'GeoIPNekudoService', 'AnalyzeTraceroute', function ($scope, $http, $q, $log, HostService, TracerouteGraphService, UnixTimeConverterService, GeoIPNekudoService, AnalyzeTraceroute, toastr) {


  $scope.Hello = function () {

    $log.debug("HELLO")
    toastr.success('Hello world!', '');
  }
}]);
