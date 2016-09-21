/**
 * Created by Nazri on 27/7/16.
 */

var latencyServices = angular.module('LatencyServices', ['GeneralServices']);

latencyServices.factory('LatencyResultsService', ['$http', '$log', 'HostService', function ($http, $log, HostService) {


  return {

    getMainResult: function (params) {
      return $http({
        method: 'GET',
        url: HostService.getHost(),
        params: params,
        cache: true
      })

    },

    getIndividualResult: function (url, params) {
      //URL is the response[i]['url'] taken from the getMainResult();

      return $http({
        method: 'GET',
        url: url,
        params: params,
        cache: true
      });


    }

  }


}]);


// This service draws the main Latency graph
latencyServices.factory('LatencyGraphService', [function () {


  var cy = cytoscape({
    container: document.getElementById('latency_graph_cytoscape'),

    style: [
      {
        selector: 'node',
        style: {
          'height': 20,
          'width': 20,
          'background-color': '#30c9bc',
          'label': 'data(label)'
        }
      },

      {
        selector: 'edge',
        style: {
          'width': 2,
          'opacity': 1,
          'label': 'data(latency)',
          'line-color': 'GreenYellow',
          'target-arrow-color': 'black',
          //Note that this is expensive to load.
          'curve-style': 'bezier',
          // tee, triangle, triangle-tee, triangle-backcurve, square, circle, diamond, or none
          'target-arrow-shape': 'triangle'
          // 'min-zoomed-font-size': 50
        }
      },
      {
        selector: '.multiline-manual',
        style: {
          'text-wrap': 'wrap'
        }
      },
      {
        selector: 'node[sourceNode = "true"]',
        style: {
          'height': 30,
          'width': 30,
          'background-color': 'DimGray'
        }
      },
      {
        // selector: 'edge[tracerouteError = "true"]',
        // style: {
        //   'line-color': 'IndianRed'
        // }
      }
    ],
    pixelRatio: 1,
    //Might want to consider to true if graph is taking a long time to load.
    textureOnViewport: false,
    hideEdgesOnViewport: false,

    ready: function () {
      // window.cy = this;


    }

    // Layout can only be done in Controller.
  });


  return {

    add_node: function (ID, main) {
      var mainNode;


      if (main == true) {
        mainNode = "true";
      } else {
        mainNode = "false";
      }

      var node = {
        group: 'nodes',
        // NB: id fields must be strings or numbers
        data: {
          // element data (put dev data here)
          // mandatory for each element, assigned automatically on undefined
          id: ID,
          sourceNode: mainNode,
          // startNode: 0,
          // endNode: 0,
          country: null,
          city: null,
          label: ID

          // parent: 'nparent', // indicates the compound node parent id; not defined => no parent
        },
        classes: 'multiline-manual'// a space separated list of class names that the element has


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


      };

      // console.log("Node ID: " + ID + " created.");


      cy.add(node);
      return cy;
    },

    add_edge: function (ID, source, target, tracerouteRTT, latency, time, startNode, endNode, metadataKey,rttMax,rttMin,rttMean) {


      //Max
      //Min
      //Mode
      //Mean

      var edge = {
        group: 'edges',
        data: {
          id: ID,
          source: source, // the source node id (edge comes from this node)
          target: target,  // the target node id (edge goes to this node)

          rtt: tracerouteRTT,
          // bandwidth: bandwidth,
          latency: latency,
          time: time,
          startNode: startNode,
          endNode: endNode,
          metadataKey: metadataKey,
          rttMax: rttMax,
          rttMin: rttMin,
          rttMean: rttMean
        }

      };
      // console.log("Edge ID: " + ID + " Source: " + source + " Target: " + target + " created.");
      //return edge;

      cy.add(edge);
      return cy;
    },

    getGraph: function () {
      return cy;
    }
  }


}]);

