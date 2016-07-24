// /**
//  * Created by Nazri on 25/7/16.
//  */
//
// var bandwidth = angular.module('traceroute', ['TracerouteServices', 'IPAddrDecodeServices', 'GeneralServices', 'uiGmapgoogle-maps']).config(['uiGmapGoogleMapApiProvider', function (GoogleMapApiProviders) {
//   // GoogleMapApiProviders.configure({
//   //   key: 'AIzaSyBgSYT0qquQTzCZrnHL_Tkos7m1pSsA92A',
//   //   v: '3.20', //defaults to latest 3.X anyhow
//   //   libraries: 'weather,geometry,visualization'
//   // });
// }])
//
// bandwidth.controller('bw_cytoscape', ['$scope', '$http', 'HostService', 'CytoscapeService_Bandwidth', 'UnixTimeConverterService', function ($scope, $http, HostService, CytoscapeService_Bandwidth, UnixTimeConverterService) {
//
//   // var host1 = "http://ps2.jp.apan.net/esmond/perfsonar/archive/";
//   var host1 = HostService.getHost();
//
//
//   $http({
//     method: 'GET',
//     url: host1,
//     params: {
//       'format': 'json',
//       'event-type': 'packet-trace',
//       'limit': 10,
//       // 'time-end': (Math.floor(Date.now() / 1000)),
//       'time-range': 86400
//     },
//
//     cache: true
//
//   }).then(function successCallback(response) {
//
//
//     for (var i = 0; i < response.data.length; i++) {
//
//       var startNode = response.data[i]['source'];
//       var destinationNode = response.data[i]['destination'];
//       var mainForLoopCounter = i;
//
//
//       if (CytoscapeService_Bandwidth.getGraph().elements('node[id = "' + startNode + '"]').size() == 0) {
//         CytoscapeService_Bandwidth.add_node(response.data[i]['source'], true, response.data[i]['source'], response.data[i]['destination']);
//       }
//
//       for (var j = 0; j < response.data[i]['event-types'].length; j++) {
//         if (response.data[i]['event-types'][j]['event-type'] == 'packet-trace') {
//
//           $http({
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
//           }).then(function successCallback(response2) {
//             // console.log("$http: Second Traceroute Call");
//             //console.log(response2.data[0]['ts']);
//
//             var tsqd = destinationNode;
//             console.log("Inner Destination: " + tsqd);
//             console.log("Inner Source: " + response.data[mainForLoopCounter]['source']);
//
//
//             var reversedResponse = response2.data.reverse();
//
//             // May not need to loop. can access array directly, display size to user.
//
//             var timeOfResultsArray = [];
//             for (var k = 0; k < reversedResponse.length; k++) {
//
//               $scope.tracerouteTime = UnixTimeConverterService.getDate(reversedResponse[k]['ts']);
//               $scope.tracerouteDate = UnixTimeConverterService.getTime(reversedResponse[k]['ts']);
//
//               timeOfResultsArray.push(reversedResponse[k]['ts']);
//
//               var temp_ip = [];
//
//               for (var l = 0; l < reversedResponse[k]['val'].length; l++) {
//                 // console.log("Metadakey : " + response.data[mainForLoopCounter]['metadata-key'])
//
//                 if (reversedResponse[k]['val'][l]['query'] == 1) {
//                   temp_ip.push(reversedResponse[k]['val'][l]['ip']);
//                 }
//               }
//
//               // Adding Nodes and Edges
//               for (var m = 0; m < temp_ip.length; m++) {
//                 if (CytoscapeService_Bandwidth.getGraph().elements('node[id = "' + temp_ip[m] + '"]').size() == 0) {
//                   CytoscapeService_Bandwidth.add_node(temp_ip[m], false);
//                 }
//               }
//
//
//               for (var m = 0; m < temp_ip.length; m++) {
//                 if (m != (temp_ip.length - 1 )) {
//                   var edgeID = temp_ip[m] + "to" + temp_ip[m + 1];
//                   if (CytoscapeService_Bandwidth.getGraph().elements('edge[id = "' + edgeID + '"]').size() == 0) {
//                     CytoscapeService_Bandwidth.add_edge(edgeID, temp_ip[m], temp_ip[m + 1], null, null, response.data[mainForLoopCounter]['source'], response.data[mainForLoopCounter]['destination']);
//                   }
//                 }
//               }
//
//
//               // Edge for main node
//               var edgeID = response.data[mainForLoopCounter]['source'] + "to" + reversedResponse[k]['val'][0]['ip'];
//               if (CytoscapeService_Bandwidth.getGraph().elements('edge[id = "' + edgeID + '"]').size() == 0) {
//                 CytoscapeService_Bandwidth.add_edge(edgeID, response.data[mainForLoopCounter]['source'], reversedResponse[k]['val'][0]['ip'], null, null, response.data[mainForLoopCounter]['source'], response.data[mainForLoopCounter]['destination'])
//               }
//
//               // Break so that we grab only the latest traceroute path
//               break;
//
//               // But return TS.
//             }
//
//             $scope.timeOfResultsArray = timeOfResultsArray;
//             // Loop it outside on scope
//
//
//             //Style Options
//             CytoscapeService_Bandwidth.getGraph().style()
//             // .selector('#203.30.39.127')
//             // .selector(':selected')
//             // .selector('[id = "203.30.39.127"]')
//               .selector('node[mainNode = "true"]')
//               .style({
//                 'background-color': 'black'
//               }).update();
//
//
//             //cy.elements('node[startNode = "true"]').size();
//
//
//             var layoutOptions = {
//               name: 'breadthfirst',
//               fit: true, // whether to fit the viewport to the graph
//               directed: false, // whether the tree is directed downwards (or edges can point in any direction if false)
//               padding: 30, // padding on fit
//               circle: false, // put depths in concentric circles if true, put depths top down if false
//               spacingFactor: 1.75, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
//               boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
//               avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
//               roots: undefined, // the roots of the trees
//               maximalAdjustments: 0, // how many times to try to position the nodes in a maximal way (i.e. no backtracking)
//               animate: false, // whether to transition the node positions
//               animationDuration: 500, // duration of animation in ms if enabled
//               animationEasing: undefined, // easing of animation if enabled
//               ready: undefined, // callback on layoutready
//               stop: undefined // callback on layoutstop
//             };
//
//             CytoscapeService_Bandwidth.getGraph().layout(layoutOptions);
//
//
//             $scope.mainNodes = CytoscapeService_Bandwidth.getGraph().elements('node[mainNode = "true"]').size();
//             $scope.NonMainNodes = CytoscapeService_Bandwidth.getGraph().elements('node[mainNode = "false"]').size();
//             $scope.totalNodes = CytoscapeService_Bandwidth.getGraph().elements('node').size();
//
//
//             // cy.style()
//             //   .selector('edge')
//             //   .style({
//             //     'width': '10',
//             //     'curve-style': 'haystack',
//             //     'line-color' :'black',
//             //     'line-style' : 'solid',
//             //     'target-arrow-color': 'black',
//             //    'target-arrow-shape': 'triangle'
//             //   }).update();
//
//
//           }, function errorCallback(response2) {
//             console.log("Second $http error: " + response2);
//           });
//
//         }
//       }
//
//
//     }
//
//   }, function errorCallback(response) {
//
//   });
//
//
// }]);
//
// // http://www.dwmkerr.com/promises-in-angularjs-the-definitive-guide/
// bandwidth.controller('bw_cytoscape_promises', ['$scope', '$http', '$q', 'HostService', 'CytoscapeService_Bandwidth', 'UnixTimeConverterService', function ($scope, $http, $q, HostService, CytoscapeService_Bandwidth, UnixTimeConverterService) {
//
//   var host1 = HostService.getHost();
//
//   $http({
//     method: 'GET',
//     url: host1,
//     params: {
//       'format': 'json',
//       'event-type': 'packet-trace',
//       'limit': 10,
//       // 'time-end': (Math.floor(Date.now() / 1000)),
//       'time-range': 86400
//     },
//     cache: false
//   }).then(function (response) {
//     // Store the username, get the profile.
//     // details.username = response.data;
//
//
//     for (var i = 0; i < response.data.length; i++) {
//       var promises = [];
//       var startNode = response.data[i]['source'];
//       var destinationNode = response.data[i]['destination'];
//
//       if (CytoscapeService_Bandwidth.getGraph().elements('node[id = "' + startNode + '"]').size() == 0) {
//         CytoscapeService_Bandwidth.add_node(response.data[i]['source'], true, startNode, destinationNode);
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
//             cache: false
//           });
//
//           promises.push(promise);
//         }
//       }
//
//       populateGraph(promises, startNode, destinationNode);
//
//     }
//   });
//
//   function populateGraph(promises, startNode, destinationNode) {
//
//     $q.all(promises).then(function (response) {
//       // console.log("Last Then, START NODE: " + start);
//       // console.log("Last Then, END NODE: " + end);
//
//       for (var i = 0; i < response.length; i++) {
//
//         var reversedResponse = response[i].data;
//
//         for (var j = 0; j < reversedResponse.length; j++) {
//           $scope.tracerouteTime = UnixTimeConverterService.getDate(reversedResponse[j]['ts']);
//           $scope.tracerouteDate = UnixTimeConverterService.getTime(reversedResponse[j]['ts']);
//
//           var temp_ip = [];
//
//           for (var k = 0; k < reversedResponse[j]['val'].length; k++) {
//             if (reversedResponse[j]['val'][k]['query'] == 1) {
//               temp_ip.push(reversedResponse[j]['val'][k]['ip']);
//             }
//           }
//
//           // Adding Nodes
//           for (var m = 0; m < temp_ip.length; m++) {
//             if (CytoscapeService_Bandwidth.getGraph().elements('node[id = "' + temp_ip[m] + '"]').size() == 0) {
//               CytoscapeService_Bandwidth.add_node(temp_ip[m], false);
//             }
//           }
//
//           // Adding edges
//           for (var m = 0; m < temp_ip.length; m++) {
//             if (m != (temp_ip.length - 1 )) {
//               var edgeID = temp_ip[m] + "to" + temp_ip[m + 1];
//               if (CytoscapeService_Bandwidth.getGraph().elements('edge[id = "' + edgeID + '"]').size() == 0) {
//                 CytoscapeService_Bandwidth.add_edge(edgeID, temp_ip[m], temp_ip[m + 1], null, null, startNode, destinationNode);
//               }
//             }
//           }
//
//           // Add Edge for main node
//           var edgeID = startNode + "to" + reversedResponse[j]['val'][0]['ip'];
//           if (CytoscapeService_Bandwidth.getGraph().elements('edge[id = "' + edgeID + '"]').size() == 0) {
//             CytoscapeService_Bandwidth.add_edge(edgeID, startNode, reversedResponse[j]['val'][0]['ip'], null, null, startNode, destinationNode);
//           }
//
//           // Break so that we grab only the latest traceroute path
//           break;
//         }
//
//       }
//
//       //Style Options
//       CytoscapeService_Bandwidth.getGraph().style()
//       // .selector('#203.30.39.127')
//       // .selector(':selected')
//       // .selector('[id = "203.30.39.127"]')
//         .selector('node[mainNode = "true"]')
//         .style({
//           'background-color': 'black'
//         }).update();
//
//       var layoutOptions = {
//         name: 'breadthfirst',
//         fit: true, // whether to fit the viewport to the graph
//         directed: false, // whether the tree is directed downwards (or edges can point in any direction if false)
//         padding: 30, // padding on fit
//         circle: false, // put depths in concentric circles if true, put depths top down if false
//         spacingFactor: 1.75, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
//         boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
//         avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
//         roots: undefined, // the roots of the trees
//         maximalAdjustments: 0, // how many times to try to position the nodes in a maximal way (i.e. no backtracking)
//         animate: false, // whether to transition the node positions
//         animationDuration: 500, // duration of animation in ms if enabled
//         animationEasing: undefined, // easing of animation if enabled
//         ready: undefined, // callback on layoutready
//         stop: undefined // callback on layoutstop
//       };
//
//       CytoscapeService_Bandwidth.getGraph().layout(layoutOptions);
//
//
//     })
//   }
//
// }]);
//
// bandwidth.controller('updateBandwidth', ['$scope', '$http', 'HostService', 'CytoscapeService_Bandwidth', 'UnixTimeConverterService', function ($scope, $http, HostService, CytoscapeService_Bandwidth, UnixTimeConverterService) {
//
//
//   // var host1 = "http://ps2.jp.apan.net/esmond/perfsonar/archive/";
//   var host1 = HostService.getHost();
//
//   // Option1. For each edge, get BW of parentNode/DestinationNode
//   // Option2. Get all BW, loop through edge, get all similar.
//
//
//   // ng-click - click event.
//   $scope.getBandwidth = function () {
//     console.log("Updating graph with bandwidth data..");
//
//     $http({
//       method: 'GET',
//       url: host1,
//       params: {
//         'format': 'json',
//         'event-type': 'throughput',
//         'limit': 10,
//         // 'time-end': (Math.floor(Date.now() / 1000)),
//         'time-range': 86400
//       },
//
//       cache: false
//
//     }).then(function successCallback(response) {
//
//
//       for (var i = 0; i < response.data.length; i++) {
//
//         var startNode = response.data[i]['source'];
//         var destinationNode = response.data[i]['destination'];
//         var mainForLoopCounter = i;
//
//         //String or integer?
//         // var edges = CytoscapeService_Bandwidth.getGraph().elements('edge[startNode = "' + startNode + '"][endNode = "' + destinationNode + '"]');
//         var edges = CytoscapeService_Bandwidth.getGraph().elements('edge[startNode = ' + startNode + '][endNode = ' + destinationNode + ']');
//
//         alert(edges.size())
//
//         for (var j = 0; j < response.data[i]['event-types'].length; j++) {
//           if (response.data[i]['event-types'][j]['event-type'] == 'throughput') {
//
//             // console.log("BW Source: "+ startNode + " BW Destination: "+ destinationNode);
//             // Assuming that there are unique BW destination.
//
//
//             // Might want to consider break after 1 loop.
//             for (var k = 0; k < response.data[i]['event-types'][j]['summaries'].length; k++) {
//
//               var bw_summary_url = response.data[i]['url'] + "/throughput/averages/" + response.data[i]['event-types'][j]['summaries'][k]['summary-window'];
//
//               $http({
//                 method: 'GET',
//                 url: bw_summary_url,
//                 params: {
//                   'format': 'json',
//                   // 'limit': '2',
//                   // 'time-end': (Math.floor(Date.now() / 1000)),
//                   'time-range': response.data[i]['event-types'][j]['summaries'][k]['summary-window']
//                   //48 Hours = 172800
//                   // 24 hours = 86400
//                 },
//                 cache: false
//               }).then(function successCallback(response2) {
//
//                 var ts;
//                 var val;
//
//                 var reversedResponse = response2.data.reverse();
//
//                 for (var k = 0; k < reversedResponse.length; k++) {
//
//                   ts = reversedResponse[k]['ts'];
//                   bw = reversedResponse[k]['val']
//
//                 }
//
//
//                 for (var k = 0; k < edges.size(); k++) {
//
//                   // Need to check whether bw is double or string
//                   edge[k].data({
//                     bandwidth: bw
//                   });
//
//                 }
//
//                 //CytoscapeService_Bandwidth.getGraph().style.update();
//
//               }, function errorCallback(response2) {
//                 // console.log("Second $http error: " + response2);
//               });
//
//
//             }
//
//
//           }
//         }
//
//
//       }
//
//     }, function errorCallback(response) {
//
//     });
//
//
//   }
//
// }]);
