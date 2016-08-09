angular.module('traceroute').controller('LatencyGraphCtrl', ['$scope', '$http', '$q', '$log', 'HostService', 'LatencyGraphService', 'UnixTimeConverterService', 'GeoIPNekudoService', 'UniqueArrayService', 'Latency_To_Traceroute_InfoService', function ($scope, $http, $q, $log, HostService, LatencyGraphService, UnixTimeConverterService, GeoIPNekudoService, UniqueArrayService, Latency_To_Traceroute_InfoService) {

  var host = HostService.getHost();
  var sourceAndDestinationList;
  var nodeToIPList;

  $http({
    method: 'GET',
    url: host,
    params: {
      'format': 'json',
      'event-type': 'histogram-rtt',
      // 'limit': 10,
      // 'time-end': (Math.floor(Date.now() / 1000)),
      // 'time-range': 86400
    },
    cache: true
  }).then(function (response) {

    sourceAndDestinationList = [];
    nodeToIPList = [];
    var promises = [];

    for (var i = 0; i < response.data.length; i++) {

      sourceAndDestinationList.push(
        {
          source: response.data[i]['source'],
          destination: response.data[i]['destination'],
          metadataKey: response.data[i]['metadata-key']
        }
      );

      //Adding DESTINATION nodes into visualisation
      if (LatencyGraphService.getGraph().elements('node[id = "' + response.data[i]['destination'] + '"]').size() == 0) {
        // $log.debug("Unique Destination Name: " + response.data[i]['destination'])
        LatencyGraphService.add_node(response.data[i]['destination'], false, null, null);
        nodeToIPList.push(response.data[i]['destination']);

        // Event
        LatencyGraphService.getGraph().on('tap', 'node[id = "' + response.data[i]['destination'] + '"]', function (event) {

        });
      }

      //Adding SOURCE nodes into visualisation
      if (LatencyGraphService.getGraph().elements('node[id = "' + response.data[i]['source'] + '"]').size() == 0) {
        // $log.debug("Unique Source Name: " + response.data[i]['source'])
        LatencyGraphService.add_node(response.data[i]['source'], true, response.data[i]['source'], response.data[i]['destination']);
        nodeToIPList.push(response.data[i]['source']);

        // Event
        LatencyGraphService.getGraph().on('tap', 'node[id = "' + response.data[i]['source'] + '"]', function (event) {

        });

      } else {
        //update it to be source node as well.
        LatencyGraphService.getGraph().elements('node[id = "' + response.data[i]['source'] + '"]').data({
          mainNode: "true"
        });
      }

      //Adding EDGES for SOURCE and DESTINATION
      if (LatencyGraphService.getGraph().elements('edge[id = "' + response.data[i]['metadata-key'] + '"]').size() == 0) {

        LatencyGraphService.add_edge(response.data[i]['metadata-key'], response.data[i]['source'], response.data[i]['destination'], null, null, null, response.data[i]['source'], response.data[i]['destination'], response.data[i]['metadata-key']);

        // Event
        LatencyGraphService.getGraph().getElementById(response.data[i]['metadata-key']).on('tap', function (event) {
          var element = event.cyTarget;

          // window.dispatchEvent(new Event('resize'));

          Latency_To_Traceroute_InfoService.setMetadata(element.data().metadataKey)
          Latency_To_Traceroute_InfoService.setTracerouteGraph(element.data().startNode, element.data().endNode).then(function (response) {

            $scope.tracerouteTime = response[0][0] + ":" + response[0][1] + ":" + response[0][2] + " " + response[0][3];
            $scope.tracerouteDate = response[1][0] + " " + response[1][1] + " " + response[1][2];


          });

          $scope.$apply(function (response) {


            $scope.latencyMetadata = element.data().metadataKey;

            $scope.$broadcast('LatencyMetadata', element.data().metadataKey);
            // $scope.showLatencyInfo = true;
            // $scope.latencyDate = UnixTimeConverterService.getDate(element.data().latencyTime);
            // $scope.latencyTime = UnixTimeConverterService.getTime(element.data().latencyTime);


          });


          // Style Options
          Latency_To_Traceroute_InfoService.getGraph().style()
            .selector('node[mainNode = "true"]')
            .style({
              'background-color': 'DimGray'
            }).update();


          // search for ALL edges with same metadata, make it GreenYellow, make everything else the same.
          LatencyGraphService.getGraph().style().selector("edge").style({
            'line-color': 'GreenYellow',
            'width': 2
          }).update();

          LatencyGraphService.getGraph().style()
            .selector('edge[id = "' + element.data().metadataKey + '"]')
            .style({
              'line-color': 'SteelBlue',
              'width': 4.5
            }).update();


        })

      }


      for (var j = 0; j < response.data[i]['event-types'].length; j++) {

        if (response.data[i]['event-types'][j]['event-type'] == 'histogram-rtt') {

          for (var k = 0; k < response.data[i]['event-types'][j]['summaries'].length; k++) {

            //Choose Aggregation or Statistics.

            if (response.data[i]['event-types'][j]['summaries'][k]['summary-type'] == "statistics" && response.data[i]['event-types'][j]['summaries'][k]['summary-window'] == 0) {


              var latencyURL = response.data[i]['url'] + "histogram-rtt/" + response.data[i]['event-types'][j]['summaries'][k]['summary-type'] + "/" + response.data[i]['event-types'][j]['summaries'][k]['summary-window']

              // $log.debug("LATENCY URL: "+ latencyURL)

              var promise = $http({
                method: 'GET',
                url: latencyURL,
                params: {
                  'format': 'json',
                  // 'limit': '2',
                  // 'time-end': (Math.floor(Date.now() / 1000)),
                  'time-range': 86400
                  //48 Hours = 172800
                  // 24 hours = 86400
                },
                cache: true
              });

              promises.push(promise);
            }


          }

        }
      }

    }

    // $log.debug("sourceAndDestinationList Size: " + sourceAndDestinationList.length);
    return $q.all(promises);

  }).then(function (response) {

    // $log.debug("$q response length: " + response.length);
    // $log.debug("sourceAndDestinationList length: " + response.length);

    for (var i = 0; i < response.length; i++) {

      var startNode = sourceAndDestinationList[i].source;
      var destinationNode = sourceAndDestinationList[i].destination;
      var metadataKey = sourceAndDestinationList[i].metadataKey;

      var reversedResponse = response[i].data.reverse();

      for (var j = 0; j < reversedResponse.length; j++) {
        // $log.debug("reversedResponse Length: " + reversedResponse.length)
        // $log.debug("ts : " + reversedResponse[j]['ts'])

        var edge = LatencyGraphService.getGraph().elements('edge[startNode = "' + startNode + '"][endNode = "' + destinationNode + '"]');
        var latencyMean = reversedResponse[j]['val']['mean'];

        edge.data({
          latency: math.round(latencyMean, 3),
          latencyTime: reversedResponse[j]['ts']
        })

        break;
      }

    }


    var uniqueIP = UniqueArrayService.getUnique(nodeToIPList);
    var nodeToIP_promises = [];

    for (var i = 0; i < uniqueIP.length; i++) {
      nodeToIP_promises.push(GeoIPNekudoService.getCountry(uniqueIP[i]));
    }

    return $q.all(nodeToIP_promises);

  }).then(function (response) {

    for (var i = 0; i < response.length; i++) {

      // ('[id = "203.30.39.127"]')
      var node = LatencyGraphService.getGraph().elements('[id = "' + response[i].ip + '"]');
      node.data({
        label: response[i].ip + "\n" + response[i].city + ", " + response[i].countrycode
      });

    }

    //Style Options
    LatencyGraphService.getGraph().style()
      .selector('node[mainNode = "true"]')
      .style({
        'background-color': 'DimGray'
      }).update();


    var layoutOptions = {
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

    LatencyGraphService.getGraph().layout(layoutOptions);


  }).catch(function (error) {
    $log.debug("LatencyGraphCtrl ERROR:")
    $log.debug(error);
    $log.debug("Server Response: " + error.status);

  });


}]);


angular.module('traceroute').controller('LatencyInfoCtrl', ['$scope', '$http', '$q', '$log', 'HostService', 'Latency_To_Traceroute_GraphService', 'UnixTimeConverterService', 'Latency_To_Traceroute_InfoService', function ($scope, $http, $q, $log, HostService, Latency_To_Traceroute_GraphService, UnixTimeConverterService, Latency_To_Traceroute_InfoService) {

  $log.debug("LatencyHistoryCtrl:START");

  //To allow Cytoscape graph to load upon showing/hiding.
  //window.dispatchEvent(new Event('resize'));
  var host = HostService.getHost();

  $scope.$on('LatencyMetadata', function (event, metadata) {


    $scope.showTraceroute = true;

    window.dispatchEvent(new Event('resize'));
    var latencyMetadata = metadata;
    var metadataURL = host + latencyMetadata + "/";

    $scope.latencyMetadata = metadata;


    //Retrieving indepth result of that metadata

    $http({
      method: 'GET',
      url: metadataURL,
      params: {
        'format': 'json',
        'event-type': 'histogram-rtt',
        // 'limit': 10,
        // 'time-end': (Math.floor(Date.now() / 1000)),
        // 'time-range': 86400
      },
      cache: true
    }).then(function (response) {

      $scope.latencySummaryData = [];


      for (var j = 0; j < response.data['event-types'].length; j++) {

        if (response.data['event-types'][j]['event-type'] == 'histogram-rtt') {


          for (var k = 0; k < response.data['event-types'][j]['summaries'].length; k++) {


            $scope.latencySummaryData.push({
              type: response.data['event-types'][j]['summaries'][k]['summary-type'],
              uri: response.data['event-types'][j]['summaries'][k]['uri'],
              time: UnixTimeConverterService.getTime(response.data['event-types'][j]['summaries'][k]['time-updated']),
              date: UnixTimeConverterService.getDate(response.data['event-types'][j]['summaries'][k]['time-updated']),
              window: response.data['event-types'][j]['summaries'][k]['summary-window'],
              url: response.data['url'],
              event_type: response.data['event-types'][j]['event-type']

            });

          }

        }
      }


    }).catch(function (error) {
      $log.debug("LatencyHistoryCtrl: ERROR")
      console.log(error);
      $log.debug("Server Response: " + error.status);

    });

  });

  $scope.showTracerouteFunction = function () {
    $scope.showTraceroute = true;
  }

  $scope.loadLatencySummaryChart = function (URL, event_type, summary_type, summary_window, uri) {
    $scope.showTraceroute = false;

    $log.debug("LatencyInformationCtrl: loadLatencySummaryChart " + uri);

    // var latencyURL = response.data[i]['url'] + "histogram-rtt/" + response.data[i]['event-types'][j]['summaries'][k]['summary-type'] + "/" + response.data[i]['event-types'][j]['summaries'][k]['summary-window']

    if (summary_type == "aggregation") {
      var individualLatencyResultsURL = URL + event_type + "/" + summary_type + "s/" + summary_window;
    } else {
      var individualLatencyResultsURL = URL + event_type + "/" + summary_type + "/" + summary_window;
    }

    $log.debug("LatencyInformationCtrl: loadLatencySummaryChart URL:" + individualLatencyResultsURL);

    $http({
      method: 'GET',
      url: individualLatencyResultsURL,
      params: {
        'format': 'json',
        // 'event-type': 'histogram-rtt',
        // 'limit': 10,
        // 'time-end': (Math.floor(Date.now() / 1000)),
        'time-range': 86400
        // 604800 = 7 days
        // 86400 = 24 hours
      },
      cache: true
    }).then(function (response) {

      if (summary_type == "aggregation") {

        $scope.resultTypeAggregation = true;
        $scope.individualLatencyResults = [];
        // var reversedResponse = response.data.reverse();
        var reversedResponse = response.data;

        for (var i = 0; i < reversedResponse.length; i++) {
          var labels = [];
          var values = [];

          // reversedResponse[i]['val'].s

          angular.forEach(reversedResponse[i]['val'], function (value, key) {

            labels.push(key);
            values.push(value);

          });

          $log.debug(labels);
          $log.debug(values);

          var time = UnixTimeConverterService.getTime(reversedResponse[i]['ts']);
          var date = UnixTimeConverterService.getDate(reversedResponse[i]['ts']);


          $scope.individualLatencyResults.push({
            time: time[0] + ":" + time[1] + ":" + time[2] + " " + time[3],
            date: date[0] + " " + date[1] + " " + date[2],
            label: labels,
            data: values

            // type: response.data['event-types'][j]['summaries'][k]['summary-type'],
            // uri: response.data['event-types'][j]['summaries'][k]['uri'],
            //
            // window: response.data['event-types'][j]['summaries'][k]['summary-window'],
            // url: response.data['url'],
            // event_type: response.data['event-types'][j]['event-type']

          });


          // $scope.IndividualLatencyResultIndex = 0;

        }
      }

      if (summary_type == "statistics") {
        $scope.resultTypeAggregation = false;
        $scope.individualLatencyResults = [];
        // var reversedResponse = response.data.reverse();
        var reversedResponse = response.data;

        for (var i = 0; i < reversedResponse.length; i++) {


          // reversedResponse[i]['val'].s


          $log.debug(labels);
          $log.debug(values);

          var time = UnixTimeConverterService.getTime(reversedResponse[i]['ts']);
          var date = UnixTimeConverterService.getDate(reversedResponse[i]['ts']);


          $scope.individualLatencyResults.push({
            time: time[0] + ":" + time[1] + ":" + time[2] + " " + time[3],
            date: date[0] + " " + date[1] + " " + date[2],
            stddev: reversedResponse[i]['val']['standard-deviation'],
            median: reversedResponse[i]['val']['median'],
            maximum: reversedResponse[i]['val']['maximum'],
            minimum: reversedResponse[i]['val']['minimum'],
            percentile75: reversedResponse[i]['val']['percentile-75'],
            percentile95: reversedResponse[i]['val']['percentile-95'],
            percentile25: reversedResponse[i]['val']['percentile-25'],
            variance: reversedResponse[i]['val']['variance'],
            mean: reversedResponse[i]['val']['mean']

          });


          // $scope.IndividualLatencyResultIndex = 0;

        }

        $scope.individualLatencyResults.reverse();
      }


    }).catch(function (error) {
      $log.debug("LatencyInformationCtrl:loadLatencySummaryChart ERROR")
      $log.debug(error);
      $log.debug("Server Response: " + error.status);

    });


    $scope.loadIndividualLatencyChart = function (key) {

      $scope.IndividualLatencyResultIndex = key;

    };


    // $scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    // $scope.series = ['Series A', 'Series B'];
    //
    // $scope.data = [
    //   [65, 59, 80, 81, 56, 55, 40],
    //   [28, 48, 40, 19, 86, 27, 90]
    // ];
  }


}]);


angular.module('traceroute').controller('LatencyGraphPanelCtrl', ['$scope', '$log', '$cacheFactory', 'LatencyGraphService', 'Latency_To_Traceroute_GraphService', function ($scope, $log, $cacheFactory, LatencyGraphService, Latency_To_Traceroute_GraphService) {

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

    LatencyGraphService.getGraph().layout(options);
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

    LatencyGraphService.getGraph().layout(options);

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

    LatencyGraphService.getGraph().layout(options);

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

    LatencyGraphService.getGraph().layout(options);

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

    LatencyGraphService.getGraph().layout(options);

  }

  $scope.graphCentred = function () {
    LatencyGraphService.getGraph().centre();
    LatencyGraphService.getGraph().fit();
    // LatencyGraphService.getGraph().zoomingEnabled(true);
  }

  $scope.tracerouteGraphCentred = function () {
    Latency_To_Traceroute_GraphService.getGraph().centre();
    Latency_To_Traceroute_GraphService.getGraph().fit();

  }

  $scope.graphCentred_traceroute = function () {
    //FIXME: Insert the
    LatencyGraphService.getGraph().centre();
    LatencyGraphService.getGraph().fit();
  }

  $scope.graphLoadAllResults = function () {

    LatencyGraphService.getGraph().remove('node');
    LatencyGraphService.getGraph().remove('edge');
    //Calls a function to pull and load everything.


  }

  $scope.searchNode = function (IPAddr) {


    $log.debug("Node Search: " + IPAddr);

    // elements('node[id = "' + response.data[i]['source'] + '"]')

    // LatencyGraphService.getGraph().center('node[id = "' + IPAddr.trim() + '"]');
    LatencyGraphService.getGraph().fit('node[id = "' + IPAddr.trim() + '"]');


  }

  $scope.clearCache = function () {
    $cacheFactory.get('$http').removeAll();

    //FIXME: Perhaps do a restart as well.
  }


}]);


// Empty Module
angular.module('traceroute').controller('LatencyInformation', ['$scope', '$http', '$q', '$log', 'HostService', 'LatencyGraphService', 'UnixTimeConverterService', function ($scope, $http, $q, $log, HostService, LatencyGraphService, UnixTimeConverterService) {


  $scope.showMe = function () {
    $scope.show = true;
  }


}]);
