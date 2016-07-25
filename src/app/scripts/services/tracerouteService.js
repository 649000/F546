/**
 * Created by Nazri on 28/2/16.
 */

var tracerouteServices = angular.module('TracerouteServices', ['ngResource', 'GeneralServices']);

//var tracerouteListURL = 'http://hpc-perfsonar.usc.edu/esmond/perfsonar/archive/'
//var tracerouteResultURL = tracerouteListURL + ':metadata_key/packet-trace/base'

var tracerouteResultURL = 'http://ps2.jp.apan.net/esmond/perfsonar/archive/'
var tracerouteResultIndividualURL = tracerouteResultURL + ':metadata_key/packet-trace/base'


// REST and Custom Services
//https://docs.angularjs.org/tutorial/step_11


//Register a custom service using a factory function
//Passed in the name of the service - 'Phone'


// Break down services to granular level as opposed to only calling ALL results.

// TracerouteResult, TracerouteResultIndividual, TRIndividualValue
//


tracerouteServices.factory('CytoscapeService', [function () {

  var cy = cytoscape({
    container: document.getElementById('tr_plot_cytoscape_2'),

    style: [
      {
        selector: 'node',
        style: {
          'height': 20,
          'width': 20,
          'background-color': '#30c9bc',
          'label': 'data(id)'
        }
      },

      {
        selector: 'edge',
        style: {
          'width': 3,
          'opacity': 0.8,
          'label': 'data(id)',
          'line-color': '#a8ea00',
          'target-arrow-color': 'black',
          'target-arrow-shape': 'triangle'
        }
      }
    ]

    // Layout can only be done in Controller.

    // layout: {
    //   name: 'concentric',
    // }


  });


  return {
    add_node: function (ID, main, startNode, endNode) {
      var mainNode;


      if (main == true) {
        mainNode = "true";
      } else {
        mainNode = "false";
      }

      var node = {
        group: 'nodes',
        // 'nodes' for a node, 'edges' for an edge
        // NB the group field can be automatically inferred for you but specifying it
        // gives you nice debug messages if you mis-init elements

        // NB: id fields must be strings or numbers
        data: {
          // element data (put dev data here)
          // mandatory for each element, assigned automatically on undefined
          id: ID,
          mainNode: mainNode,
          startNode: 0,
          endNode: 0

          // parent: 'nparent', // indicates the compound node parent id; not defined => no parent
        }


        // scratchpad data (usually temp or nonserialisable data)
        // scratch: {
        //   foo: 'bar'
        // },
        //
        // position: { // the model position of the node (optional on init, mandatory after)
        //   x: 100,
        //   y: 100
        // },
        //
        // selected: false, // whether the element is selected (default false)
        //
        // selectable: true, // whether the selection state is mutable (default true)
        //
        // locked: false, // when locked a node's position is immutable (default false)
        //
        // grabbable: true // whether the node can be grabbed and moved by the user

        // class: 'mainNode'// a space separated list of class names that the element has
      };

      // console.log("Node ID: " + ID + " created.");


      cy.add(node);
      return cy;
    },

    add_edge: function (ID, source, target, bandwidth, latency) {

      var edge = {
        group: 'edges',
        data: {
          id: ID,
          // inferred as an edge because `source` and `target` are specified:
          source: source, // the source node id (edge comes from this node)
          target: target,  // the target node id (edge goes to this node)
          bandwidth: bandwidth,
          latency: latency
        }
      };
      // console.log("Edge ID: " + ID + " Source: " + source + " Target: " + target + " created.");
      //return edge;

      cy.add(edge);
      return cy;
    },

    update_node: function (ID, data) {
      // cy.elements('node[id = "' + ID + '"]')
      var element = cy.getElementById(ID);
      element.data(data);
      return cy;
    },

    update_edge: function (ID, data) {

      // cy.elements('edge[id = "' + ID + '"]')
      var element = cy.getElementById(ID);
      element.data(data);
      return cy;
    },

    setLayout: function (selector) {

      cy.style()
      // .selector('#203.30.39.127')
      // .selector(':selected')
      // .selector('[id = "203.30.39.127"]')
        .selector('node[mainNode = "true"]')
        .style({
          'background-color': 'black'
        }).update();

      return cy;
    },

    getGraph: function () {
      return cy;
    }
  }


}]);


tracerouteServices.factory('CytoscapeService_Bandwidth', [function () {

  // Key Differences
  // 1. Edge ID is unique, Math.random()

  var cy = cytoscape({
    container: document.getElementById('cytoscape_bandwidth'),

    style: [
      {
        selector: 'node',
        style: {
          'height': 20,
          'width': 20,
          'background-color': '#30c9bc',
          'label': 'data(id)'
        }
      },

      {
        selector: 'edge',
        style: {
          'width': 3,
          'opacity': 0.8,
          'label': 'data(bandwidth)',
          'line-color': '#a8ea00',
          'target-arrow-color': 'black',
          'target-arrow-shape': 'triangle'
        }
      }
    ]

    // Layout can only be done in Controller.

    // layout: {
    //   name: 'concentric',
    // }


  });


  return {
    add_node: function (ID, main, startNode, endNode) {
      var mainNode;


      if (main == true) {
        mainNode = "true";
      } else {
        mainNode = "false";
      }

      var node = {
        group: 'nodes',
        // 'nodes' for a node, 'edges' for an edge
        // NB the group field can be automatically inferred for you but specifying it
        // gives you nice debug messages if you mis-init elements

        // NB: id fields must be strings or numbers
        data: {
          // element data (put dev data here)
          // mandatory for each element, assigned automatically on undefined
          id: ID,
          mainNode: mainNode,
          startNode: 0,
          endNode: 0

          // parent: 'nparent', // indicates the compound node parent id; not defined => no parent
        }


        // scratchpad data (usually temp or nonserialisable data)
        // scratch: {
        //   foo: 'bar'
        // },
        //
        // position: { // the model position of the node (optional on init, mandatory after)
        //   x: 100,
        //   y: 100
        // },
        //
        // selected: false, // whether the element is selected (default false)
        //
        // selectable: true, // whether the selection state is mutable (default true)
        //
        // locked: false, // when locked a node's position is immutable (default false)
        //
        // grabbable: true // whether the node can be grabbed and moved by the user

        // class: 'mainNode'// a space separated list of class names that the element has
      };

      // console.log("Node ID: " + ID + " created.");


      cy.add(node);
      return cy;
    },

    add_edge: function (ID, source, target, bandwidth, latency, startNode, endNode) {


      var edge = {
        group: 'edges',
        data: {
          id: Math.random(),
          // inferred as an edge because `source` and `target` are specified:
          source: source, // the source node id (edge comes from this node)
          target: target,  // the target node id (edge goes to this node)
          bandwidth: bandwidth,
          latency: latency,
          startNode: startNode,
          endNode: endNode
        }
      };
      // console.log("Edge ID: " + ID + " Source: " + source + " Target: " + target + " created.");
      //return edge;

      cy.add(edge);
      return cy;
    },

    update_node: function (ID, data) {
      // cy.elements('node[id = "' + ID + '"]')
      var element = cy.getElementById(ID);
      element.data(data);
      return cy;
    },

    update_edge: function (ID, data) {

      // cy.elements('edge[id = "' + ID + '"]')
      var element = cy.getElementById(ID);
      element.data(data);
      return cy;
    },

    setLayout: function (selector) {

      cy.style()
      // .selector('#203.30.39.127')
      // .selector(':selected')
      // .selector('[id = "203.30.39.127"]')
        .selector('node[mainNode = "true"]')
        .style({
          'background-color': 'black'
        }).update();

      return cy;
    },

    getGraph: function () {
      return cy;
    }
  }


}]);


tracerouteServices.factory('TracerouteResultsService', ['$resource', '$http', '$q', 'HostService', function ($http, $q, HostService) {

  var host = HostService.getHost();

  return {

    getMainResult: function () {

      return $http({
        method: 'GET',
        url: host,
        params: {
          'format': 'json',
          'event-type': 'packet-trace'
          // 'limit': 10,
          // 'time-end': (Math.floor(Date.now() / 1000)),
          // 'time-range': timeRange
        },
        cache: true
      })
    },

    getIndividualResult: function (metadataURL,timeRange) {

      return $http({
        method: 'GET',
        url: metadataURL + "packet-trace/base",
        params: {
          'format': 'json',
          // 'limit': '2',
          // 'time-end': (Math.floor(Date.now() / 1000)),
          'time-range': timeRange
          //48 Hours = 172800
          // 24 hours = 86400
          //604800 (7days).
        },
        cache: true
      });
    }

  };


  function httpCall() {

    $http({
      method: 'GET',
      url: host,
      params: {
        'format': 'json',
        'event-type': 'packet-trace',
        'limit': 10,
        // 'time-end': (Math.floor(Date.now() / 1000)),
        'time-range': 86400
      },

      cache: true

    }).then(function (response) {

      for (var i = 0; i < response.data.length; i++) {
        var startNode = response.data[i]['source'];
        var destinationNode = response.data[i]['destination'];
        var promises = [];


        if (CytoscapeService.getGraph().elements('node[id = "' + startNode + '"]').size() == 0) {
          CytoscapeService.add_node(startNode, true, startNode, destinationNode);

          // Gotta add event here else event gets added repeated times.
          CytoscapeService.getGraph().on('mouseup', 'node[id = "' + startNode + '"]', function (event) {
            console.log(event);
            console.log("clicked")

            var node = event.cyTarget;
            console.log('tapped ' + node.id());

          });
        }

        for (var j = 0; j < response.data[i]['event-types'].length; j++) {
          if (response.data[i]['event-types'][j]['event-type'] == 'packet-trace') {

            var promise = $http({
              method: 'GET',
              url: response.data[i]['url'] + "packet-trace/base",
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

        populateGraph(promises, startNode, destinationNode);


      }


    }).catch(function (error) {
      console.log("An error occured: " + error);
    });
  }

  function populateGraph(promises, startNode, destinationNode) {

    $q.all(promises).then(function (response) {
      for (var i = 0; i < response.length; i++) {

        var reversedResponse = response[i].data;

        for (var k = 0; k < reversedResponse.length; k++) {

          $scope.tracerouteTime = UnixTimeConverterService.getDate(reversedResponse[k]['ts']);
          $scope.tracerouteDate = UnixTimeConverterService.getTime(reversedResponse[k]['ts']);

          var temp_ip = [];

          for (var l = 0; l < reversedResponse[k]['val'].length; l++) {
            if (reversedResponse[k]['val'][l]['query'] == 1) {
              temp_ip.push(reversedResponse[k]['val'][l]['ip']);
            }
          }

          // Adding Nodes
          for (var m = 0; m < temp_ip.length; m++) {
            if (CytoscapeService.getGraph().elements('node[id = "' + temp_ip[m] + '"]').size() == 0) {
              CytoscapeService.add_node(temp_ip[m], false);
            }
          }

          // May potentially remove this for loop, however this helps to eliminate the error.

          //Adding Edges
          for (var m = 0; m < temp_ip.length; m++) {
            if (m != (temp_ip.length - 1 )) {
              var edgeID = temp_ip[m] + "to" + temp_ip[m + 1];
              if (CytoscapeService.getGraph().elements('edge[id = "' + edgeID + '"]').size() == 0) {
                CytoscapeService.add_edge(edgeID, temp_ip[m], temp_ip[m + 1], 100000, 100000);
              }
            }
          }


          // Edge for main node
          var edgeID = startNode + "to" + reversedResponse[k]['val'][0]['ip'];
          if (CytoscapeService.getGraph().elements('edge[id = "' + edgeID + '"]').size() == 0) {
            CytoscapeService.add_edge(edgeID, startNode, reversedResponse[k]['val'][0]['ip'], Math.random(), 100000)
          }

          // Break so that we grab only the latest traceroute path
          break;
        }


        //Style Options
        CytoscapeService.getGraph().style()
        // .selector('#203.30.39.127')
        // .selector(':selected')
        // .selector('[id = "203.30.39.127"]')
          .selector('node[mainNode = "true"]')
          .style({
            'background-color': 'black'
          }).update();


        //cy.elements('node[startNode = "true"]').size();


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

        CytoscapeService.getGraph().layout(layoutOptions);


        $scope.mainNodes = CytoscapeService.getGraph().elements('node[mainNode = "true"]').size();
        $scope.NonMainNodes = CytoscapeService.getGraph().elements('node[mainNode = "false"]').size();
        $scope.totalNodes = CytoscapeService.getGraph().elements('node').size();


        // cy.style()
        //   .selector('edge')
        //   .style({
        //     'width': '10',
        //     'curve-style': 'haystack',
        //     'line-color' :'black',
        //     'line-style' : 'solid',
        //     'target-arrow-color': 'black',
        //    'target-arrow-shape': 'triangle'
        //   }).update();

      }

    });

  }

}]);


tracerouteServices.factory('TracerouteMainResult_URL', ['$resource', function ($resource) {

  // Calls the main result page.
  // url : "http://ps2.jp.apan.net/esmond/perfsonar/archive/0a468985ca8b41029a22ae4e4645f869/"
  // metadata-key : "0a468985ca8b41029a22ae4e4645f869"
  // subject-type : "point-to-point"
  // event-types
  // source : "203.30.39.127"
  // destination : "137.189.192.25"
  // measurement-agent : "203.30.39.127"
  // tool-name : "bwctl/tracepath"
  // input-source : "203.30.39.127"
  // input-destination : "ps1.itsc.cuhk.edu.hk"
  // time-interval : "600"
  // ip-transport-protocol : "icmp"
  // ip-packet-size : "40"
  // uri : "/esmond/perfsonar/archive/0a468985ca8b41029a22ae4e4645f869/"
  // metadata-count-total : 23
  // metadata-previous-page : null
  // metadata-next-page : null


  // https://docs.angularjs.org/api/ngResource/service/$resource
  return $resource(tracerouteResultURL, {}, {

    list: {
      method: 'GET',
      params: {'format': 'json', 'event-type': 'packet-trace'},
      isArray: true
    }

  });

}]);
tracerouteServices.factory('TracerouteMainResults', ['$resource', function ($resource) {

  // Calls the main result page.
  // url : "http://ps2.jp.apan.net/esmond/perfsonar/archive/0a468985ca8b41029a22ae4e4645f869/"
  // metadata-key : "0a468985ca8b41029a22ae4e4645f869"
  // subject-type : "point-to-point"
  // event-types
  // source : "203.30.39.127"
  // destination : "137.189.192.25"
  // measurement-agent : "203.30.39.127"
  // tool-name : "bwctl/tracepath"
  // input-source : "203.30.39.127"
  // input-destination : "ps1.itsc.cuhk.edu.hk"
  // time-interval : "600"
  // ip-transport-protocol : "icmp"
  // ip-packet-size : "40"
  // uri : "/esmond/perfsonar/archive/0a468985ca8b41029a22ae4e4645f869/"
  // metadata-count-total : 23
  // metadata-previous-page : null
  // metadata-next-page : null


  // https://docs.angularjs.org/api/ngResource/service/$resource
  return $resource(tracerouteResultURL, {}, {

    list: {
      method: 'GET',
      params: {'format': 'json', 'event-type': 'packet-trace'},
      isArray: true
    }

  });

}]);


tracerouteServices.factory('TracerouteIndividualResults', ['$resource', function ($resource) {

  // Calls the individual test containing various hops.

  //URL Format
  // 'http://hpc-perfsonar.usc.edu/esmond/perfsonar/archive/123AAAAAAA/packet-trace/base'
  // substitute 123AAAA with :metadata_key, similar to parameters

  return $resource(tracerouteResultIndividualURL, {}, {
    get: {
      method: 'GET',
      params: {'format': 'json'},
      isArray: true
    }


  });

}]);

