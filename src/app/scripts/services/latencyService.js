/**
 * Created by Nazri on 27/7/16.
 */

var latencyServices = angular.module('LatencyServices', ['ngResource', 'GeneralServices']);

// This service draws the main Latency graph
latencyServices.factory('LatencyGraphService', [function () {

// cache http://stackoverflow.com/questions/21660647/angular-js-http-cache-time

  var cy = cytoscape({
    container: document.getElementById('latency_graph_cytoscape'),

    style: [
      {
        selector: 'node',
        style: {
          'height': 20,
          'width': 20,
          'background-color': 'LightSeaGreen',
          'label': 'data(label)'
        }
      },

      {
        selector: 'edge',
        style: {
          'width': 2,
          'opacity': 0.8,
          'label': 'data(latency)',
          'line-color': 'GreenYellow',
          'target-arrow-color': 'black',
          // tee, triangle, triangle-tee, triangle-backcurve, square, circle, diamond, or none
          'target-arrow-shape': 'triangle'
        }
      },
      {
        selector: '.multiline-manual',
        style: {
          'text-wrap': 'wrap'
        }
      }
    ],
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
          mainNode: mainNode,
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

    add_edge: function (ID, source, target, tracerouteRTT, bandwidth, latency, startNode, endNode, metadataKey, latencyTime) {


      var edge = {
        group: 'edges',
        data: {
          id: ID,
          // inferred as an edge because `source` and `target` are specified:
          source: source, // the source node id (edge comes from this node)
          target: target,  // the target node id (edge goes to this node)
          rtt: tracerouteRTT,
          bandwidth: bandwidth,
          latency: latency,
          startNode: startNode,
          endNode: endNode,
          metadataKey: metadataKey,
          latencyTime: latencyTime
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

// This service draws the main Traceroute graph of the selected latency path
latencyServices.factory('Latency_To_Traceroute_GraphService', [function () {

  var cy = cytoscape({
    container: document.getElementById('latency_graph_cytoscape_traceroute'),

    style: [
      {
        selector: 'node',
        style: {
          'height': 20,
          'width': 20,
          'background-color': 'LightSeaGreen',
          'label': 'data(label)'
        }
      },

      {
        selector: 'edge',
        style: {
          'width': 2,
          'opacity': 0.8,
          'label': 'data(latency)',
          'line-color': 'GreenYellow',
          'target-arrow-color': 'black',
          // tee, triangle, triangle-tee, triangle-backcurve, square, circle, diamond, or none
          'target-arrow-shape': 'triangle'
        }
      },
      {
        selector: '.multiline-manual',
        style: {
          'text-wrap': 'wrap'
        }
      }
    ],
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
        // 'nodes' for a node, 'edges' for an edge
        // NB the group field can be automatically inferred for you but specifying it
        // gives you nice debug messages if you mis-init elements

        // NB: id fields must be strings or numbers
        data: {
          id: ID,
          mainNode: mainNode,
          // startNode: startNode,
          // endNode: endNode,
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

    add_edge: function (ID, source, target, tracerouteRTT, bandwidth, latency, startNode, endNode, metadataKey, latencyTime) {


      var edge = {
        group: 'edges',
        data: {
          id: ID,
          source: source, // the source node id (edge comes from this node)
          target: target,  // the target node id (edge goes to this node)
          rtt: tracerouteRTT,
          bandwidth: bandwidth,
          latency: latency,
          startNode: startNode,
          endNode: endNode,
          metadataKey: metadataKey,
          latencyTime: latencyTime
        }

      };

      // console.log("Edge ID: " + ID + " Source: " + source + " Target: " + target + " created.");

      cy.add(edge);
      return cy;
    },

    getGraph: function () {
      return cy;
    }
  }


}]);

//This services pulls information to draw Traceroute and uses Latency_To_Traceroute_GraphService to draw it.
latencyServices.factory('Latency_To_Traceroute_InfoService', ['$http', '$q', '$cacheFactory', '$log', 'HostService', 'Latency_To_Traceroute_GraphService', 'GeoIPNekudoService', 'UnixTimeConverterService', function ($http, $q, $cacheFactory, $log, HostService, Latency_To_Traceroute_GraphService, GeoIPNekudoService, UnixTimeConverterService) {

  $log.debug("Latency_To_Traceroute_InfoService:START");


  var metadataList = [];
  var metadata = "";


  return {
    //Clear traceroute path and calls info to populate
    setTracerouteGraph: function (source, destination) {
      var host = HostService.getHost();
      var sourceAndDestinationList = [];
      var nodeList = [];
      var errorInTraceroute = false;
      var ts;

      Latency_To_Traceroute_GraphService.getGraph().remove('node');
      Latency_To_Traceroute_GraphService.getGraph().remove('edge');


      return $http({
        method: 'GET',
        url: host,
        params: {
          'format': 'json',
          'event-type': 'packet-trace',
          // 'limit': 10,
          // 'time-end': (Math.floor(Date.now() / 1000)),
          'time-range': 604800,

          'source': source,
          'destination': destination
        },
        cache: true

      }).then(function (response) {

        var promises = [];

        for (var i = 0; i < response.data.length; i++) {
          //Taking only the latest path
          var reversedResponse = response.data.reverse();

          sourceAndDestinationList.push(
            {
              source: reversedResponse[i]['source'],
              destination: reversedResponse[i]['destination'],
              metadataKey: reversedResponse[i]['metadata-key']
            }
          );


          if (Latency_To_Traceroute_GraphService.getGraph().elements('node[id = "' + reversedResponse[i]['source'] + '"]').size() == 0) {

            Latency_To_Traceroute_GraphService.add_node(reversedResponse[i]['source'], true);
            nodeList.push(reversedResponse[i]['source']);

            // Event
            Latency_To_Traceroute_GraphService.getGraph().on('tap', 'node[id = "' + reversedResponse[i]['source'] + '"]', function (event) {
              var element = event.cyTarget;

            });
          }


          for (var j = 0; j < reversedResponse[i]['event-types'].length; j++) {

            if (reversedResponse[i]['event-types'][j]['event-type'] == 'packet-trace') {

              var promise = $http({
                method: 'GET',
                url: reversedResponse[i]['url'] + "packet-trace/base",
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

          //Retrieves the latest traceroute result
          break;
        }

        return $q.all(promises);

      }).then(function (response) {

        // $log.debug("$q response length: " + response.length);
        // $log.debug("sourceAndDestinationList length: " + response.length);


        for (var i = 0; i < response.length; i++) {

          var startNode = sourceAndDestinationList[i].source;
          var destinationNode = sourceAndDestinationList[i].destination;
          var metadataKey = sourceAndDestinationList[i].metadataKey;

          // NOTE RESULTS MAY COME IN THIS FORM:
          // {
          //   "success": 0,
          //   "ip": null,
          //   "error_message": "requestTimedOut",
          //   "mtu": null,
          //   "rtt": null,
          //   "ttl": "1",
          //   "query": "1"
          // },

          var reversedResponse = response[i].data.reverse();

          for (var j = 0; j < reversedResponse.length; j++) {
            // $log.debug("reversedResponse Length: " + reversedResponse.length)
            // $log.debug("ts : " + reversedResponse[j]['ts'])
            ts = reversedResponse[j]['ts'];

            // IP keeps appending and adding inside, without checking if it's unique. Unique at per iteration.
            var temp_ip = [];
            var temp_rtt = [];

            for (var k = 0; k < reversedResponse[j]['val'].length; k++) {

              if (reversedResponse[j]['val'][k]['success'] == 1) {


                if (reversedResponse[j]['val'][k]['query'] == 1) {
                  temp_ip.push(reversedResponse[j]['val'][k]['ip']);
                  temp_rtt.push(reversedResponse[j]['val'][k]['rtt']);
                }
              }
              if (reversedResponse[j]['val'][k]['success'] == 0) {
                errorInTraceroute = true;
              }

            }


            // Adding Nodes
            for (var m = 0; m < temp_ip.length; m++) {
              if (Latency_To_Traceroute_GraphService.getGraph().elements('node[id = "' + temp_ip[m] + '"]').size() == 0) {

                // $log.debug("Node To Add: "+temp_ip[m] )
                Latency_To_Traceroute_GraphService.add_node(temp_ip[m], false);
                nodeList.push(temp_ip[m]);

                //event
                Latency_To_Traceroute_GraphService.getGraph().on('tap', 'node[id = "' + temp_ip[m] + '"]', function (event) {

                })

              }
            }

            // Adding edges
            for (var m = 0; m < temp_ip.length; m++) {
              if (m != (temp_ip.length - 1 )) {

                // var edgeID = temp_ip[m] + "to" + temp_ip[m + 1];
                var edgeID = Math.random();

                if (Latency_To_Traceroute_GraphService.getGraph().elements('edge[id = "' + edgeID + '"]').size() == 0) {

                  Latency_To_Traceroute_GraphService.add_edge(edgeID, temp_ip[m], temp_ip[m + 1], temp_rtt[m], null, null, startNode, destinationNode, metadataKey);

                  //event
                  Latency_To_Traceroute_GraphService.getGraph().on('tap', 'edge[id = "' + edgeID + '"]', function (event) {
                    var element = event.cyTarget;
                    //ID: element.id()
                    //metadataKey: element.data().metadataKey

                  });

                }
              }


            }


            // Add Edge for main node
            // var edgeID = startNode + "to" + reversedResponse[j]['val'][0]['ip'];
            var edgeID = Math.random();

            if (Latency_To_Traceroute_GraphService.getGraph().elements('edge[id = "' + edgeID + '"]').size() == 0) {

              Latency_To_Traceroute_GraphService.add_edge(edgeID, startNode, reversedResponse[j]['val'][0]['ip'], temp_rtt[m], null, null, startNode, destinationNode, metadataKey);

              Latency_To_Traceroute_GraphService.getGraph().on('tap', 'edge[id = "' + edgeID + '"]', function (event) {
                var element = event.cyTarget;

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

          var node = Latency_To_Traceroute_GraphService.getGraph().elements('[id = "' + response[i].ip + '"]');
          node.data({
            label: response[i].ip + "\n" + response[i].city + ", " + response[i].countrycode
          });
        }

        Latency_To_Traceroute_GraphService.getGraph().layout({
          name: 'breadthfirst',
          fit: true, // whether to fit the viewport to the graph
          directed: false, // whether the tree is directed downwards (or edges can point in any direction if false)
          padding: 30, // padding on fit
          circle: true, // put depths in concentric circles if true, put depths top down if false
          spacingFactor: 1.0, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
          boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
          avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
          roots: undefined, // the roots of the trees
          maximalAdjustments: 0, // how many times to try to position the nodes in a maximal way (i.e. no backtracking)
          animate: false, // whether to transition the node positions
          animationDuration: 500, // duration of animation in ms if enabled
          animationEasing: undefined, // easing of animation if enabled
          ready: undefined, // callback on layoutready
          stop: undefined // callback on layoutstop
        });

        if (errorInTraceroute == true) {
          Latency_To_Traceroute_GraphService.getGraph().elements('node[id = "' + sourceAndDestinationList[0].source + '"]').qtip
          ({
            content: {
              title: 'Error in Traceroute Results',
              text: 'Traceroute may be incomplete or inaccurate.',
              button: 'Close'

            },
            position: {my: 'bottom center', at: 'bottom top'},
            show: {
              ready: true,

              cyBgOnly: false


            },
            hide: {},
            style: {classes: 'qtip-bootstrap', tip: {width: 16, height: 8}}
          });
        }


        return [UnixTimeConverterService.getTime(ts), UnixTimeConverterService.getDate(ts)];

      }).catch(function (error) {
        $log.debug("Latency_To_Traceroute_InfoService:setTracerouteGraph()")
        console.log(error)
        $log.debug("Server Response: " + error.status);

      })

      //Note cannot return any out of this as it's a promise.

    },


    getSummaries: function () {

      //$http

    },
    addMetadataList: function (metadata_key) {
      metadataList.push(metadata_key);
      return metadataList;
    },
    getMetadataList: function () {
      return metadataList
    },
    setMetadata: function (metadata_key) {
      metadata = metadata_key;
      return metadata;
    },
    getMetadata: function () {
      return metadata;
    },

    getGraph: function () {
      return Latency_To_Traceroute_GraphService.getGraph();
    }


  };


}]);

