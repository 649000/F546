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

// traceroute.controller('bw_cytoscape', ['$scope', '$http', '$q', '$log', 'HostService', 'CytoscapeService_Bandwidth', 'UnixTimeConverterService', 'GeoIPNekudoService', function ($scope, $http, $q, $log, HostService, CytoscapeService_Bandwidth, UnixTimeConverterService, GeoIPNekudoService) {
//
//
//   $http({
//     method: 'GET',
//     url: host,
//     params: {
//       'format': 'json',
//       'event-type': 'packet-trace',
//       'limit': 10,
//       // 'time-end': (Math.floor(Date.now() / 1000)),
//       'time-range': 86400
//     },
//     cache: true
//   }).then(function (response) {
//
//     sourceAndDestinationList = [];
//     nodeList = [];
//     var promises = [];
//
//     for (var i = 0; i < response.data.length; i++) {
//
//       // $log.info("Initial Source Name: " + response.data[i]['source'])
//       sourceAndDestinationList.push(
//         {
//           source: response.data[i]['source'],
//           destination: response.data[i]['destination'],
//           metadataKey: response.data[i]['metadata-key']
//         }
//       );
//
//
//       // var startNode = response.data[i]['source'];
//       // var destinationNode = response.data[i]['destination'];
//
//       if (CytoscapeService_Bandwidth.getGraph().elements('node[id = "' + response.data[i]['source'] + '"]').size() == 0) {
//
//         // $log.debug("Unique Source Name: " + response.data[i]['source'])
//
//         CytoscapeService_Bandwidth.add_node(response.data[i]['source'], true, response.data[i]['source'], response.data[i]['destination']);
//         nodeList.push(response.data[i]['source']);
//
//         // Event
//         CytoscapeService_Bandwidth.getGraph().on('tap', 'node[id = "' + response.data[i]['source'] + '"]', function (event) {
//
//
//         });
//
//       }
//
//       for (var j = 0; j < response.data[i]['event-types'].length; j++) {
//
//         if (response.data[i]['event-types'][j]['event-type'] == 'packet-trace') {
//
//           var promise = $http({
//             method: 'GET',
//             url: response.data[i]['url'] + "packet-trace/base",
//             params: {
//               'format': 'json',
//               // 'limit': '2',
//               // 'time-end': (Math.floor(Date.now() / 1000)),
//               'time-range': 86400
//               //48 Hours = 172800
//               // 24 hours = 86400
//             },
//             cache: true
//           });
//
//           promises.push(promise);
//         }
//       }
//
//       // populateGraph(promises, startNode, destinationNode);
//
//     }
//
//     // $log.debug("sourceAndDestinationList Size: " + sourceAndDestinationList.length)
//     return $q.all(promises);
//
//   }).then(function (response) {
//     // $log.debug("$q response length: " + response.length);
//     // $log.debug("sourceAndDestinationList length: " + response.length);
//
//     for (var i = 0; i < response.length; i++) {
//
//       var startNode = sourceAndDestinationList[i].source;
//       var destinationNode = sourceAndDestinationList[i].destination;
//       var metadataKey = sourceAndDestinationList[i].metadataKey;
//
//       // NOTE RESULTS MAY COME IN THIS FORM:
//       // {
//       //   "success": 0,
//       //   "ip": null,
//       //   "error_message": "requestTimedOut",
//       //   "mtu": null,
//       //   "rtt": null,
//       //   "ttl": "1",
//       //   "query": "1"
//       // },
//
//
//       var reversedResponse = response[i].data.reverse();
//
//
//       for (var j = 0; j < reversedResponse.length; j++) {
//         // $log.debug("reversedResponse Length: " + reversedResponse.length)
//         // $log.debug("ts : " + reversedResponse[j]['ts'])
//
//         $scope.tracerouteTime = UnixTimeConverterService.getDate(reversedResponse[j]['ts']);
//         $scope.tracerouteDate = UnixTimeConverterService.getTime(reversedResponse[j]['ts']);
//
//         // IP keeps appending and adding inside, without checking if it's unique. Unique at per iteration.
//         var temp_ip = [];
//         var temp_rtt = [];
//
//         for (var k = 0; k < reversedResponse[j]['val'].length; k++) {
//           if (reversedResponse[j]['val'][k]['query'] == 1) {
//
//             // if (reversedResponse[j]['val'][k]['ip'] == "207.231.246.132") {
//             //   $log.debug("FOUND IT")
//             //   $log.debug(metadataKey)
//             //   $log.debug(reversedResponse[j]['ts'])
//             //
//             // }
//             temp_ip.push(reversedResponse[j]['val'][k]['ip']);
//             temp_rtt.push(reversedResponse[j]['val'][k]['rtt']);
//           }
//         }
//
//         // Adding Nodes
//         for (var m = 0; m < temp_ip.length; m++) {
//           if (CytoscapeService_Bandwidth.getGraph().elements('node[id = "' + temp_ip[m] + '"]').size() == 0) {
//
//             // $log.debug("Node To Add: "+temp_ip[m] )
//             CytoscapeService_Bandwidth.add_node(temp_ip[m], false);
//
//             nodeList.push(temp_ip[m]);
//
//             CytoscapeService_Bandwidth.getGraph().on('tap', 'node[id = "' + temp_ip[m] + '"]', function (event) {
//
//
//             })
//
//           }
//         }
//
//         // Adding edges
//         for (var m = 0; m < temp_ip.length; m++) {
//           if (m != (temp_ip.length - 1 )) {
//
//             // var edgeID = temp_ip[m] + "to" + temp_ip[m + 1];
//             var edgeID = Math.random();
//
//             if (CytoscapeService_Bandwidth.getGraph().elements('edge[id = "' + edgeID + '"]').size() == 0) {
//
//               CytoscapeService_Bandwidth.add_edge(edgeID, temp_ip[m], temp_ip[m + 1], temp_rtt[m], null, null, startNode, destinationNode, metadataKey);
//
//               CytoscapeService_Bandwidth.getGraph().on('tap', 'edge[id = "' + edgeID + '"]', function (event) {
//                 var element = event.cyTarget;
//                 //ID: element.id()
//                 //metadataKey: element.data().metadataKey
//
//
//                 // search for ALL edges with same metadata, make it red, make everything else the same.
//                 CytoscapeService_Bandwidth.getGraph().style().selector("edge").style({
//                   'line-color': '#a8ea00',
//                   'width': 2
//                 }).update();
//
//                 CytoscapeService_Bandwidth.getGraph().style()
//                 // .selector('#203.30.39.127')
//                 // .selector(':selected')
//                 // .selector('[id = "203.30.39.127"]')
//                   .selector('edge[metadataKey = "' + element.data().metadataKey + '"]')
//                   .style({
//                     'line-color': 'green',
//                     'width': 4
//                   }).update();
//
//
//               });
//
//             }
//           }
//         }
//
//
//         // Add Edge for main node
//         // var edgeID = startNode + "to" + reversedResponse[j]['val'][0]['ip'];
//         var edgeID = Math.random();
//
//         if (CytoscapeService_Bandwidth.getGraph().elements('edge[id = "' + edgeID + '"]').size() == 0) {
//
//           CytoscapeService_Bandwidth.add_edge(edgeID, startNode, reversedResponse[j]['val'][0]['ip'], temp_rtt[m], null, null, startNode, destinationNode, metadataKey);
//
//           CytoscapeService_Bandwidth.getGraph().on('tap', 'edge[id = "' + edgeID + '"]', function (event) {
//             var element = event.cyTarget;
//             $log.debug("Element METADATA: " + element.data().metadataKey)
//             CytoscapeService_Bandwidth.getGraph().style().selector("edge").style({
//               'line-color': '#a8ea00',
//               'width': 2
//             }).update();
//
//             CytoscapeService_Bandwidth.getGraph().style()
//             // .selector('#203.30.39.127')
//             // .selector(':selected')
//             // .selector('[id = "203.30.39.127"]')
//               .selector('edge[metadataKey = "' + element.data().metadataKey + '"]')
//               .style({
//                 'line-color': 'green',
//                 'width': 4
//               }).update();
//
//
//           });
//         }
//
//         // Break so that we grab only the latest traceroute path
//         break;
//       }
//
//     }
//
//
//     var nodeToIP_promises = [];
//     for (var i = 0; i < nodeList.length; i++) {
//       nodeToIP_promises.push(GeoIPNekudoService.getCountry(nodeList[i]));
//     }
//
//     return $q.all(nodeToIP_promises);
//
//   }).then(function (response) {
//
//     for (var i = 0; i < response.length; i++) {
//
//
//       // ('[id = "203.30.39.127"]')
//       var node = CytoscapeService_Bandwidth.getGraph().elements('[id = "' + response[i].ip + '"]');
//       node.data({
//         label: response[i].ip + "\n" + response[i].city + ", " + response[i].countrycode
//       });
//
//
//     }
//
//     //Style Options
//     CytoscapeService_Bandwidth.getGraph().style()
//     // .selector('#203.30.39.127')
//     // .selector(':selected')
//     // .selector('[id = "203.30.39.127"]')
//       .selector('node[mainNode = "true"]')
//       .style({
//         'background-color': 'black'
//       }).update();
//
//     var layoutOptions = {
//       name: 'breadthfirst',
//       fit: true, // whether to fit the viewport to the graph
//       directed: false, // whether the tree is directed downwards (or edges can point in any direction if false)
//       padding: 30, // padding on fit
//       circle: false, // put depths in concentric circles if true, put depths top down if false
//       spacingFactor: 1.75, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
//       boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
//       avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
//       roots: undefined, // the roots of the trees
//       maximalAdjustments: 0, // how many times to try to position the nodes in a maximal way (i.e. no backtracking)
//       animate: false, // whether to transition the node positions
//       animationDuration: 500, // duration of animation in ms if enabled
//       animationEasing: undefined, // easing of animation if enabled
//       ready: undefined, // callback on layoutready
//       stop: undefined // callback on layoutstop
//     };
//
//     CytoscapeService_Bandwidth.getGraph().layout(layoutOptions);
//
//
//   }).catch(function (error) {
//     $log.debug("TracerouteController:bw_cytoscape")
//     $log.debug("Server Response: " + error.status);
//
//   });
//
//
//   // function populateGraph(promises, startNode, destinationNode) {
//   //
//   //   $q.all(promises).then(function (response) {
//   //     // console.log("Last Then, START NODE: " + start);
//   //     // console.log("Last Then, END NODE: " + end);
//   //
//   //     for (var i = 0; i < response.length; i++) {
//   //
//   //       var reversedResponse = response[i].data;
//   //
//   //       for (var j = 0; j < reversedResponse.length; j++) {
//   //         $scope.tracerouteTime = UnixTimeConverterService.getDate(reversedResponse[j]['ts']);
//   //         $scope.tracerouteDate = UnixTimeConverterService.getTime(reversedResponse[j]['ts']);
//   //
//   //         var temp_ip = [];
//   //         var temp_rtt = [];
//   //
//   //         for (var k = 0; k < reversedResponse[j]['val'].length; k++) {
//   //           if (reversedResponse[j]['val'][k]['query'] == 1) {
//   //             temp_ip.push(reversedResponse[j]['val'][k]['ip']);
//   //             temp_rtt.push(reversedResponse[j]['val'][k]['rtt']);
//   //           }
//   //         }
//   //
//   //         // Adding Nodes
//   //         for (var m = 0; m < temp_ip.length; m++) {
//   //           if (CytoscapeService_Bandwidth.getGraph().elements('node[id = "' + temp_ip[m] + '"]').size() == 0) {
//   //             CytoscapeService_Bandwidth.add_node(temp_ip[m], false);
//   //           }
//   //         }
//   //
//   //         // Adding edges
//   //         for (var m = 0; m < temp_ip.length; m++) {
//   //           if (m != (temp_ip.length - 1 )) {
//   //             var edgeID = temp_ip[m] + "to" + temp_ip[m + 1];
//   //             if (CytoscapeService_Bandwidth.getGraph().elements('edge[id = "' + edgeID + '"]').size() == 0) {
//   //               CytoscapeService_Bandwidth.add_edge(edgeID, temp_ip[m], temp_ip[m + 1], temp_rtt[m], null, null, startNode, destinationNode);
//   //             }
//   //           }
//   //         }
//   //
//   //         // Add Edge for main node
//   //         var edgeID = startNode + "to" + reversedResponse[j]['val'][0]['ip'];
//   //         if (CytoscapeService_Bandwidth.getGraph().elements('edge[id = "' + edgeID + '"]').size() == 0) {
//   //           CytoscapeService_Bandwidth.add_edge(edgeID, startNode, reversedResponse[j]['val'][0]['ip'], temp_rtt[m], null, null, startNode, destinationNode);
//   //         }
//   //
//   //         // Break so that we grab only the latest traceroute path
//   //         break;
//   //       }
//   //
//   //     }
//   //
//   //     //Style Options
//   //     CytoscapeService_Bandwidth.getGraph().style()
//   //     // .selector('#203.30.39.127')
//   //     // .selector(':selected')
//   //     // .selector('[id = "203.30.39.127"]')
//   //       .selector('node[mainNode = "true"]')
//   //       .style({
//   //         'background-color': 'black'
//   //       }).update();
//   //
//   //     var layoutOptions = {
//   //       name: 'breadthfirst',
//   //       fit: true, // whether to fit the viewport to the graph
//   //       directed: false, // whether the tree is directed downwards (or edges can point in any direction if false)
//   //       padding: 30, // padding on fit
//   //       circle: false, // put depths in concentric circles if true, put depths top down if false
//   //       spacingFactor: 1.75, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
//   //       boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
//   //       avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
//   //       roots: undefined, // the roots of the trees
//   //       maximalAdjustments: 0, // how many times to try to position the nodes in a maximal way (i.e. no backtracking)
//   //       animate: false, // whether to transition the node positions
//   //       animationDuration: 500, // duration of animation in ms if enabled
//   //       animationEasing: undefined, // easing of animation if enabled
//   //       ready: undefined, // callback on layoutready
//   //       stop: undefined // callback on layoutstop
//   //     };
//   //
//   //     CytoscapeService_Bandwidth.getGraph().layout(layoutOptions);
//   //
//   //
//   //   })
//   // }
//
// }]);
