/**
 * Created by Nazri on 24/2/16.
 */
// NOTE: App name CANNOT be in capitalized letters
// NOTE: Might want to separate tracerouteController.js out
// NOTE. Built in modules with $ should be declared first.


// This has to match with ng-app="traceroute" on HTML page
var traceroute = angular.module('traceroute', ['TracerouteServices', 'LatencyServices','IPAddrDecodeServices', 'GeneralServices', 'AnalyzationServices', 'chart.js','ngAnimate', 'toastr','ui.bootstrap']).config(['$logProvider', function ($logProvider) {

  // GoogleMapApiProviders.configure({
  //   key: 'AIzaSyBgSYT0qquQTzCZrnHL_Tkos7m1pSsA92A',
  //   v: '3.20', //defaults to latest 3.X anyhow
  //   libraries: 'weather,geometry,visualization'
  // });

  // Turn debugging on/off
  // http://stackoverflow.com/questions/15561853/how-to-turn-on-off-log-debug-in-angularjs
  $logProvider.debugEnabled(true);

}])

traceroute.directive('agclick_edge', function () {

  //http://kirkbushell.me/when-to-use-directives-controllers-or-services-in-angular/
  //https://www.toptal.com/angular-js/angular-js-demystifying-directives

  // 'A' - <span ng-sparkline></span>
  // 'E' - <ng-sparkline></ng-sparkline>
  // 'C' - <span class="ng-sparkline"></span>
  // 'M' - <!-- directive: ng-sparkline -->


  return {
    restrict: 'C',

  };
});

traceroute.directive('bsTooltip', function(){
  return {
    restrict: 'A',
    link: function(scope, element, attrs){
      $(element).hover(function(){
        // on mouseenter
        $(element).tooltip('show');
      }, function(){
        // on mouseleave
        $(element).tooltip('hide');
      });
    }
  };
});


// traceroute.controller('tr_gmaps', ['$scope', '$http', '$q', 'TracerouteMainResults', 'GEOIP_NEKUDO', 'uiGmapGoogleMapApi', function ($scope, $http, $q, TracerouteMainResults, GEOIP_NEKUDO, uiGmapGoogleMapApi) {
//
//   // Do stuff with your $scope.
//   // Note: Some of the directives require at least something to be defined originally!
//   // e.g. $scope.markers = []
//
//   // uiGmapGoogleMapApi is a promise.
//   // The "then" callback function provides the google.maps object.
//
//   var nodes = [];
//   var edges = [];
//   var host1 = "http://ps2.jp.apan.net/esmond/perfsonar/archive/";
//
//
//   $scope.map = {
//     center: {
//       latitude: 1.345468,
//       longitude: 103.956101
//     }, zoom: 8, pan: false
//   };
//   $scope.options = {
//     scrollwheel: true
//   };
//   $scope.marker = {key: 1, coords: {latitude: 45, longitude: -73}};
//
//
//   var markers = [];
//
//   markers.push(
//     {
//       id: "first",
//       latitude: 1.564836,
//       longitude: 103.718025,
//       title: "Hello1",
//       options: {labelClass: 'marker_labels', labelAnchor: '12 60', labelContent: 'm1'}
//
//     }
//   );
//   markers.push(
//     {
//       id: "second",
//       latitude: 1.512557,
//       longitude: 104.168110,
//
//     }
//   );
//
//
//   // $scope.randomMarkers = markers;
//   //
//   //
//   // $scope.randomLines = [
//   //
//   //   {
//   //     id: 1,
//   //     geotracks: [{
//   //       latitude: 1.564836,
//   //       longitude: 103.718025
//   //     }, {
//   //       latitude: 1.512557,
//   //       longitude: 104.168110
//   //     }],
//   //     stroke: {
//   //       color: '#6060FB',
//   //       weight: 1
//   //     }
//   //   }, {
//   //     id: 2,
//   //     geotracks: [{
//   //       latitude: 24.0,
//   //       longitude: 72.58
//   //     }, {
//   //       latitude: 23.1,
//   //       longitude: 71.58
//   //     }]
//   //   }];
//
//
//   uiGmapGoogleMapApi.then(function (maps) {
//     console.log("Inside GoogleMaps Then");
//
//   });
//
//   $scope.getNodes = $http({
//     method: 'GET',
//     url: host1,
//     params: {'format': 'json', 'event-type': 'packet-trace', 'time-end': (Math.floor(Date.now() / 1000)), 'limit': '1'}
//   }).then(function successCallback(response) {
//     // console.log("First $http Success");
//
//     for (var i = 0; i < response.data.length; i++) {
//       var parentIP = response.data[i]['source'];
//       var mainForLoopCounter = i;
//
//       addNode(response.data[i]['source'], response.data[i]['source']);
//
//       for (var j = 0; j < response.data[i]['event-types'].length; j++) {
//         if (response.data[i]['event-types'][j]['event-type'] == 'packet-trace') {
//
//           $http({
//             method: 'GET',
//             url: response.data[i]['url'] + "packet-trace/base",
//             params: {'format': 'json', 'limit': '1', 'time-end': (Math.floor(Date.now() / 1000))}
//           }).then(function successCallback(response2) {
//             // console.log("Second $http Success");
//             //console.log(response2.data[0]['ts']);
//
//             for (var k = 0; k < response2.data.length; k++) {
//               var ts = response2.data[k]['ts'];
//               // console.log("TS: " + ts);
//
//               // Main Node
//               // cytoscape_edges.push(add_edge(Math.random(), response.data[mainForLoopCounter]['source'] ,response2.data[k]['val'][0]['ip'], Math.random()));
//               addEdge(Math.random(), response.data[mainForLoopCounter]['source'], response2.data[k]['val'][0]['ip'], 1);
//
//               var temp_ip = [];
//               for (var l = 0; l < response2.data[k]['val'].length; l++) {
//                 if (response2.data[k]['val'][l]['query'] == 1) {
//                   temp_ip.push(response2.data[k]['val'][l]['ip']);
//                 }
//               }
//
//               // Adding Nodes and Edges
//               for (var m = 0; m < temp_ip.length; m++) {
//                 // cytoscape_nodes.push(add_node(temp_ip[m]));
//                 addNode(temp_ip[m], temp_ip[m]);
//                 if (m != (temp_ip.length - 1 )) {
//                   // cytoscape_edges.push(add_edge(Math.random(), temp_ip[m], temp_ip[m + 1],100000));
//                   addEdge(Math.random(), temp_ip[m], temp_ip[m + 1], 1);
//                 }
//               }
//
//             }
//
//           }, function errorCallback(response2) {
//             console.log("Second $http error: " + response2);
//           });
//
//
//         }
//       }
//     }
//
//   }, function errorCallback(response) {
//     console.log("First $http error: " + response);
//   });
//
//
//   $q.all([$scope.getNodes]).then(function (values) {
//
//
//   });
//   for (var i = 0; i < nodes.length; i++) {
//     GEOIP_NEKUDO.decode({ip_address: nodes[i].id}, function (decoded_ip) {
//       nodes[i].latitude = decoded_ip.location.latitude;
//       nodes[i].longitude = decoded_ip.location.longitude;
//       console.log("Latitude: " + decoded_ip.location.latitude);
//     });
//   }
//
//   // for (var i = 0; i < edges.length; i++) {
//   //   GEOIP_NEKUDO.decode({ip_address: edges[i].id}, function (decoded_ip) {
//   //     edges[i].latitude = decoded_ip.location.latitude;
//   //     edges[i].longitude = decoded_ip.location.longitude;
//   //
//   //
//   //   });
//   // }
//
//
//   function addNode(id, title) {
//     if (nodes.length > 0) {
//       var hasDuplicates = false;
//       for (var i = 0; i < nodes.length; i++) {
//         if (nodes[i].id == id) {
//           hasDuplicates = true;
//         }
//       }
//
//       if (hasDuplicates == false) {
//         nodes.push(
//           {
//             id: id,
//             latitude: 0,
//             longitude: 0,
//             title: title,
//             options: {labelClass: 'marker_labels', labelAnchor: '12 60', labelContent: 'm1'}
//
//           });
//
//       }
//     } else {
//       nodes.push(
//         {
//           id: id,
//           latitude: 0,
//           longitude: 0,
//           title: title,
//           options: {labelClass: 'marker_labels', labelAnchor: '12 60', labelContent: 'm1'}
//
//         });
//
//     }
//
//   }
//
//   function addEdge(id, source, target, weight) {
//
//     edges.push(
//       {
//         id: id,
//         geotracks: [{
//           latitude: source,
//           longitude: 0
//         }, {
//           latitude: target,
//           longitude: 0
//         }],
//         stroke: {
//           color: '#6060FB',
//           weight: weight
//         }
//       }
//     )
//
//   }
//
//   $scope.nodeMarkers = nodes;
//   $scope.edgeLines = edges;
//
//   //  var maps = new GMaps({
//   //   div: '#maps',
//   //   lat: 37.8668,
//   //   lng: -122.2536,
//   //   width: 'max-width',
//   //   height: '700px',
//   //   zoom: 12,
//   //   zoomControl: true,
//   //   zoomControlOpt: {
//   //     style: 'SMALL',
//   //     position: 'TOP_LEFT'
//   //   },
//   //   panControl: false
//   // });
//
//   //$scope.maps="<div id='maps'></div>"
//
//   // TracerouteResults.get({ metadata_key: '0171dee126dd433e817e21ca352bc517' }, function(data) {
//   //   //$scope.route_time = data[0].ts;
//   //   //for (i = 0; i < data[0].val.length; i++) {
//   //   //  console.log(data[0].val[i].ip)
//   //   //}
//   //
//   //
//   //   angular.forEach(data[0].val, function (item) {
//   //
//   //     if (previousIP != item.ip){
//   //       counter++
//   //
//   //       //console.log(item.ip)
//   //
//   //       GEOIP_NEKUDO.decode({ ip_address: item.ip }, function(decoded_ip) {
//   //         latitude = decoded_ip.location.latitude
//   //         longitude = decoded_ip.location.longitude
//   //
//   //         maps.setCenter(latitude, longitude)
//   //
//   //
//   //         //console.log(counter)
//   //         if (counter==1){
//   //          //w console.log(latitude)
//   //           firstLat=latitude
//   //           firstLon=longitude
//   //         }
//   //
//   //
//   //         plottingPath.push([latitude, longitude])
//   //
//   //
//   //
//   //           //maps.drawOverlay({
//   //           //  lat: latitude,
//   //           //  lng: longitude,
//   //           //  content: '<div class="overlay">'+decoded_ip.city+'</div>'
//   //           //});
//   //
//   //         maps.addMarker({
//   //           lat: latitude,
//   //           lng: longitude,
//   //           infoWindow: {
//   //             content: '<p>TTL #: '+ item.ttl + '</p>'
//   //           }
//   //
//   //
//   //         });
//   //         // FIXME: plottingPath initialized to zero when it's outside this function. Had to draw in here.
//   //         // Look into it and fix it
//   //         maps.drawPolyline({
//   //           path: plottingPath,
//   //           strokeColor: '#131540',
//   //           strokeOpacity: 0.6,
//   //           strokeWeight: 3
//   //         });
//   //
//   //
//   //       });
//   //
//   //       console.log(plottingPath.length)
//   //       previousIP = item.ip
//   //     }
//   //
//   //
//   //
//   //   })
//   //
//   //
//   // });
//
//   //plottingPath.push("x")
//
//   // plottingPath = [[37.7697, -122.3933], [-12.05449279282314, -77.03024273281858], [-12.055122327623378, -77.03039293652341], [-12.075917129727586, -77.02764635449216], [-12.07635776902266, -77.02792530422971], [-12.076819390363665, -77.02893381481931], [-12.088527520066453, -77.0241058385925], [-12.090814532191756, -77.02271108990476]];
//
//   //   maps.drawPolyline({
//   //   path: plottingPath,
//   //   strokeColor: '#131540',
//   //   strokeOpacity: 0.6,
//   //   strokeWeight: 6
//   // });
//
//
// }]);

// traceroute.controller('tr_d3', ['$scope', 'TracerouteMainResults', function ($scope, TracerouteMainResults) {
//
//   var previousIP, nodes = [], links = []
//   var width = 960, height = 500;
//
//   //var nodes = [
//   //  { x:   width/3, y: height/2 },
//   //  { x: 2*width/3, y: height/2 },
//   //  { x: 3*width/3, y: height/2 }
//   //];
//   //
//   //var links = [
//   //  { source: 0, target: 1 },
//   //  { source: 1, target: 2 }
//   //];
//
//   TracerouteResults.get({metadata_key: '8662af9e72fb46228ce307534bba5a7f'}, function (data) {
//
//     for (i = 0; i < data[0].val.length; i++) {
//       if (previousIP != data[0].val[i].ip) {
//         //console.log(data[0].val[i].ip)
//         nodes.push({x: i * width / 3, y: height / 2})
//         previousIP = data[0].val[i].ip
//       }
//     }
//     for (i = 0; i < nodes.length; i++) {
//       if (i != (nodes.length - 1)) {
//         links.push({source: i, target: (i + 1)})
//       }
//     }
//
//     //links.push({ source: 0, target: (1) })
//     //links.push({ source: 1, target: (2) })
//     //links.push({ source: 2, target: (3) })
//     //links.push({ source: 3, target: (4) })
//     //links.push({ source: 4, target: (5) })
//     //links.push({ source: 5, target: (6) })
//     //links.push({ source: 6, target: (7) })
//     //links.push({ source: 7, target: (8) })
//     //links.push({ source: 8, target: (9) })
//     //links.push({ source: 9, target: (10) })
//     //links.push({ source: 10, target: (11) })
//     //links.push({ source: 11, target: (12) })
//
//
//     //console.log("Node Size: "+ nodes.length)
//     //console.log("Edge Size: " + links.length)
//     //
//     //links.forEach(function(entry) {
//     //  console.log("Link: Source: "+entry.source + " Target: "+ entry.target);
//     //});
//     //
//     //nodes.forEach(function(entry) {
//     //  console.log("Node: X: "+entry.x + " Y: "+ entry.y);
//     //});
//
//
//     var svg = d3.select("#d3fgraph").append("svg")
//       .attr("width", width)
//       .attr("height", height);
//
//
//     var force = d3.layout.force()
//       .size([width, height])
//       .nodes(nodes)
//       .links(links);
//
//     force.linkDistance(width / 2);
//
//     var link = svg.selectAll('.link')
//       .data(links)
//       .enter().append('line')
//       .attr('class', 'link');
//
//     var node = svg.selectAll('.node')
//       .data(nodes)
//       .enter().append('circle')
//       .attr('class', 'node');
//
//
//     force.on('end', function () {
//
//       node.attr('r', width / 25)
//         .attr('cx', function (d) {
//           return d.x;
//         })
//         .attr('cy', function (d) {
//           return d.y;
//         });
//
//
//       link.attr('x1', function (d) {
//         return d.source.x;
//       })
//         .attr('y1', function (d) {
//           return d.source.y;
//         })
//         .attr('x2', function (d) {
//           return d.target.x;
//         })
//         .attr('y2', function (d) {
//           return d.target.y;
//         });
//
//     });
//
//     force.start();
//
//
//   });
//
//
// }]);
//

// traceroute.controller('tr_cytoscape', ['$scope', '$http', 'TracerouteMainResults', 'UnixTimeConverterService', function ($scope, $http, TracerouteMainResults, UnixTimeConverterService) {
//
//
//   var cytoscape_nodes = [];
//   var cytoscape_edges = [];
//   var host1 = "http://ps2.jp.apan.net/esmond/perfsonar/archive/";
//   var time_range = 1;
//
//   var cy = cytoscape({
//     container: document.getElementById('tr_plot_cytoscape'),
//
//     style: [
//       {
//         selector: 'node',
//         style: {
//           'height': 20,
//           'width': 20,
//           'background-color': '#30c9bc',
//           'label': 'data(id)'
//         }
//       },
//
//       {
//         selector: 'edge',
//         style: {
//           'width': 3,
//           'opacity': 0.8,
//           'line-color': '#a8ea00',
//           'target-arrow-color': 'black',
//           'target-arrow-shape': 'triangle'
//         }
//       }
//     ],
//
//   });
//
//   //   var elements = [ // list of graph elements to start with
//   //     { // node a
//   //       data: { id: 'a' }
//   //     },
//   //     { // node b
//   //       data: { id: 'c' }
//   //     },
//   //     { // edge ab
//   //       data: { id: 'ab', source: 'a', target: 'b' }
//   //     }
//   //   ];
//   //
//   // elements.push (
//   //   { // node a
//   //     data: { id: 'a' }
//   //   }
//   //
//   // )
//
//   // cy.add(elements)
//
//   // var cy = cytoscape({
//   //
//   //   container: document.getElementById('tr_plot_cytoscape'), // container to render in
//   //
//   //   elements: [ // list of graph elements to start with
//   //     { // node a
//   //       data: { id: 'a' }
//   //     },
//   //     { // node b
//   //       data: { id: 'b' }
//   //     },
//   //     { // edge ab
//   //       data: { id: 'ab', source: 'a', target: 'b' }
//   //     }
//   //   ],
//   //
//   //   // style: [ // the stylesheet for the graph
//   //   //   {
//   //   //     selector: 'node',
//   //   //     style: {
//   //   //       'background-color': '#666',
//   //   //       'label': 'data(id)'
//   //   //     }
//   //   //   },
//   //   //
//   //   //   {
//   //   //     selector: 'edge',
//   //   //     style: {
//   //   //       'width': 3,
//   //   //       'line-color': '#ccc',
//   //   //       'target-arrow-color': '#ccc',
//   //   //       'target-arrow-shape': 'triangle'
//   //   //     }
//   //   //   }
//   //   // ],
//   //
//   //   // layout: {
//   //   //   name: 'grid',
//   //   //   rows: 1
//   //   // }
//   //
//   // });
//
//
//   $http({
//     method: 'GET',
//     url: host1,
//     params: {
//       'format': 'json',
//       'event-type': 'packet-trace',
//       // 'limit': 1000,
//       // 'time-end': (Math.floor(Date.now() / 1000)),
//       'time-range': 86400
//     }
//   }).then(function successCallback(response) {
//
//     console.log("$http: First Traceroute Call");
//
//     for (var i = 0; i < response.data.length; i++) {
//       // console.log("Node Size: " + cytoscape_nodes.length)
//
//       //bandwidthService.getBandwidth(response.data[i]);
//       cytoscape_nodes.push(add_node(response.data[i]['source'], true));
//
//       var mainForLoopCounter = i;
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
//             }
//           }).then(function successCallback(response2) {
//
//             console.log("$http: Second Traceroute Call");
//             //console.log(response2.data[0]['ts']);
//
//
//             var reversedResponse = response2.data.reverse();
//
//
//             // May not need to loop. can access array directly, display size to user.
//
//             for (var k = 0; k < reversedResponse.length; k++) {
//               $scope.tracerouteTime = UnixTimeConverterService.getDate(reversedResponse[k]['ts']);
//               $scope.tracerouteDate = UnixTimeConverterService.getTime(reversedResponse[k]['ts']);
//
//               // Main Node
//               var edgeID = response.data[mainForLoopCounter]['source'] + "to" + reversedResponse[k]['val'][0]['ip'];
//               cytoscape_edges.push(add_edge(edgeID, response.data[mainForLoopCounter]['source'], reversedResponse[k]['val'][0]['ip'], Math.random()));
//
//               var temp_ip = [];
//               for (var l = 0; l < reversedResponse[k]['val'].length; l++) {
//                 if (reversedResponse[k]['val'][l]['query'] == 1) {
//                   temp_ip.push(reversedResponse[k]['val'][l]['ip']);
//                 }
//               }
//
//               // Adding Nodes and Edges
//               for (var m = 0; m < temp_ip.length; m++) {
//                 cytoscape_nodes.push(add_node(temp_ip[m], false));
//                 if (m != (temp_ip.length - 1 )) {
//                   var edgeID = temp_ip[m] + "to" + temp_ip[m + 1];
//                   cytoscape_edges.push(add_edge(edgeID, temp_ip[m], temp_ip[m + 1], 100000));
//                 }
//               }
//
//               // Break so that we grab only the latest traceroute path
//               break;
//             }
//
//             // cy.add(cytoscape_nodes);
//             // cy.add(cytoscape_edges);
//
//
//             //Layout Options
//             // cy.makeLayout({
//             //   // http://js.cytoscape.org/#layouts
//             //   // grid, random, concentric
//             //   name: 'random',
//             //   concentric: function (node) {
//             //     return node.degree();
//             //   },
//             //   levelWidth: function (nodes) {
//             //     return 2;
//             //   }
//             // }).run();
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
//
//             // var layoutOptions = {
//             //   name: 'concentric',
//             //
//             //   fit: true, // whether to fit the viewport to the graph
//             //   padding: 30, // the padding on fit
//             //   startAngle: 3 / 2 * Math.PI, // where nodes start in radians
//             //   sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
//             //   clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
//             //   equidistant: false, // whether levels have an equal radial distance betwen them, may cause bounding box overflow
//             //   minNodeSpacing: 10, // min spacing between outside of nodes (used for radius adjustment)
//             //   boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
//             //   avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
//             //   height: undefined, // height of layout area (overrides container height)
//             //   width: undefined, // width of layout area (overrides container width)
//             //   concentric: function( node ){ // returns numeric value for each node, placing higher nodes in levels towards the centre
//             //     return node.degree();
//             //   },
//             //   levelWidth: function( nodes ){ // the variation of concentric values in each level
//             //     return nodes.maxDegree() / 4;
//             //   },
//             //   animate: false, // whether to transition the node positions
//             //   animationDuration: 500, // duration of animation in ms if enabled
//             //   animationEasing: undefined, // easing of animation if enabled
//             //   ready: undefined, // callback on layoutready
//             //   stop: undefined // callback on layoutstop
//             // };
//
//             cy.layout(layoutOptions);
//
//             //Style Options
//             cy.style()
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
//             //   console.log("HELLOOO!!!: " + cy.elements('node[startNode = "true"]')[1].data('id'))
//             $scope.mainNodes = cy.elements('node[mainNode = "true"]').size();
//             $scope.totalNodes = cy.elements('node').size();
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
//     }
//
//
//   }, function errorCallback(response) {
//     console.log("First $http error: " + response);
//   });
//
//   // $scope.$emit("initialized");
//   // $scope.$on('initialized', function () {
//   //   console.log("INITIALIZED CALLED");
//   //   // still called multiple times.
//   //
//   //   //issue here
//   // });
//
//
//   // another method: http://stackoverflow.com/questions/36737213/how-to-access-ajax-response-data-outside-ajax-function-in-angularjs
//   var bandwidthService = {
//     getBandwidth: function (data) {
//
//       $http({
//         method: 'GET',
//         url: host1,
//         params: {
//           'format': 'json',
//           'event-type': 'throughput',
//           // 'limit': '2',
//           // 'time-end': (Math.floor(Date.now() / 1000)),
//           'source': data['source'],
//           'destination': data['destination'],
//           'time-range': 86400
//         }
//
//       }).then(function successCallback(response) {
//         //http://ps2.jp.apan.net/esmond/perfsonar/archive/?event-type=throughput&format=json&source=203.30.39.127&destination=202.90.129.130&time-range=86400
//
//         var reversedResponse = response.data.reverse();
//         for (var i = 0; i < reversedResponse.length; i++) {
//           // Only take the first result, technically, there should only be one.
//
//
//           for (var j = 0; j < reversedResponse[i]['event-types'].length; j++) {
//             if (reversedResponse[i]['event-types'][j]['event-type'] == 'throughput') {
//
//               for (var k = 0; k < reversedResponse[i]['event-types'][j]['summaries'].length; k++) {
//                 //reversedResponse[i]['event-types'][j]['summaries'][k]['uri']
//
//                 var tobeexecuted = reversedResponse[i]['url'] + "/throughput/averages/" + reversedResponse[i]['event-types'][j]['summaries'][k]['summary-window'];
//                 // Another $http
//
//               }
//
//             }
//           }
//
//
//           // Summaries only return 1 result, an average over past 24 hours
//           // 1 Result for One day.
//           // Base Data returns actual data.
//           break;
//         }
//
//       }, function errorCallback(response) {
//
//       });
//
//
//     }
//   };
//
//   // ng-click - click event.
//   $scope.updateGraph = function () {
//
//   }
//
//
//   $scope.getYear = function () {
//     // Do something here
//     //Call this from the main page as {{getYear()}}
//   }
//
//   function add_node(ID, startNode) {
//
//     var mainNode;
//     if (startNode) {
//       mainNode = "true";
//     } else {
//       mainNode = "false";
//     }
//
//     var node = {
//       group: 'nodes',
//       // 'nodes' for a node, 'edges' for an edge
//       // NB the group field can be automatically inferred for you but specifying it
//       // gives you nice debug messages if you mis-init elements
//
//       // NB: id fields must be strings or numbers
//       data: {
//         // element data (put dev data here)
//         // mandatory for each element, assigned automatically on undefined
//         id: ID,
//         mainNode: mainNode,
//         endNode: "false",
//         startNodeID: 1,
//         endNodeID: 2
//
//
//         // parent: 'nparent', // indicates the compound node parent id; not defined => no parent
//       }
//
//
//       // scratchpad data (usually temp or nonserialisable data)
//       // scratch: {
//       //   foo: 'bar'
//       // },
//       //
//       // position: { // the model position of the node (optional on init, mandatory after)
//       //   x: 100,
//       //   y: 100
//       // },
//       //
//       // selected: false, // whether the element is selected (default false)
//       //
//       // selectable: true, // whether the selection state is mutable (default true)
//       //
//       // locked: false, // when locked a node's position is immutable (default false)
//       //
//       // grabbable: true // whether the node can be grabbed and moved by the user
//
//       // class: 'mainNode'// a space separated list of class names that the element has
//     };
//
//     // console.log("Node ID: " + ID + " created.");
//     return node;
//   }
//
//   function add_edge(ID, source, target, bandwidth, latency) {
//
//     var edge = {
//       group: 'edges',
//       data: {
//         id: ID,
//         // inferred as an edge because `source` and `target` are specified:
//         source: source, // the source node id (edge comes from this node)
//         target: target,  // the target node id (edge goes to this node)
//         bandwidth: bandwidth,
//         latency: latency
//       }
//     };
//     // console.log("Edge ID: " + ID + " Source: " + source + " Target: " + target + " created.");
//     return edge;
//   }
//
// }]);


traceroute.controller('Traceroute_NoDuplicateCtrl', ['$scope', '$http', '$q', '$log', 'HostService', 'CytoscapeService', 'UnixTimeConverterService', function ($scope, $http, $q, $log, HostService, CytoscapeService, UnixTimeConverterService) {


  // ng-click - click event.
  $scope.loadTraceroute_NoDuplicate = function () {


    var host1 = HostService.getHost();


    $http({
      method: 'GET',
      url: host1,
      params: {
        'format': 'json',
        'event-type': 'packet-trace',
        'limit': 10,
        // 'time-end': (Math.floor(Date.now() / 1000)),
        'time-range': 86400
      },

      cache: false

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
              cache: false
            });

            promises.push(promise);

          }
        }

        populateGraph(promises, startNode, destinationNode);


      }


    }).catch(function (error) {
      console.log("An error occured: " + error);
    });

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
  }

}]);


// traceroute.controller('bw_cytoscape', ['$scope', '$http', 'HostService', 'CytoscapeService_Bandwidth', 'UnixTimeConverterService', function ($scope, $http, HostService, CytoscapeService_Bandwidth, UnixTimeConverterService) {
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

// http://www.dwmkerr.com/promises-in-angularjs-the-definitive-guide/

traceroute.controller('bw_cytoscape', ['$scope', '$http', '$q', '$log', 'HostService', 'CytoscapeService_Bandwidth', 'UnixTimeConverterService', 'GeoIPNekudoService', function ($scope, $http, $q, $log, HostService, CytoscapeService_Bandwidth, UnixTimeConverterService, GeoIPNekudoService) {

  var host = HostService.getHost();
  var sourceAndDestinationList;
  var nodeList;

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


      // var startNode = response.data[i]['source'];
      // var destinationNode = response.data[i]['destination'];

      if (CytoscapeService_Bandwidth.getGraph().elements('node[id = "' + response.data[i]['source'] + '"]').size() == 0) {

        // $log.debug("Unique Source Name: " + response.data[i]['source'])

        CytoscapeService_Bandwidth.add_node(response.data[i]['source'], true, response.data[i]['source'], response.data[i]['destination']);
        nodeList.push(response.data[i]['source']);

        // Event
        CytoscapeService_Bandwidth.getGraph().on('tap', 'node[id = "' + response.data[i]['source'] + '"]', function (event) {


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

      // populateGraph(promises, startNode, destinationNode);

    }

    // $log.debug("sourceAndDestinationList Size: " + sourceAndDestinationList.length)
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

        $scope.tracerouteTime = UnixTimeConverterService.getDate(reversedResponse[j]['ts']);
        $scope.tracerouteDate = UnixTimeConverterService.getTime(reversedResponse[j]['ts']);

        // IP keeps appending and adding inside, without checking if it's unique. Unique at per iteration.
        var temp_ip = [];
        var temp_rtt = [];

        for (var k = 0; k < reversedResponse[j]['val'].length; k++) {
          if (reversedResponse[j]['val'][k]['query'] == 1) {

            // if (reversedResponse[j]['val'][k]['ip'] == "207.231.246.132") {
            //   $log.debug("FOUND IT")
            //   $log.debug(metadataKey)
            //   $log.debug(reversedResponse[j]['ts'])
            //
            // }
            temp_ip.push(reversedResponse[j]['val'][k]['ip']);
            temp_rtt.push(reversedResponse[j]['val'][k]['rtt']);
          }
        }

        // Adding Nodes
        for (var m = 0; m < temp_ip.length; m++) {
          if (CytoscapeService_Bandwidth.getGraph().elements('node[id = "' + temp_ip[m] + '"]').size() == 0) {

            // $log.debug("Node To Add: "+temp_ip[m] )
            CytoscapeService_Bandwidth.add_node(temp_ip[m], false);

            nodeList.push(temp_ip[m]);

            CytoscapeService_Bandwidth.getGraph().on('tap', 'node[id = "' + temp_ip[m] + '"]', function (event) {


            })

          }
        }

        // Adding edges
        for (var m = 0; m < temp_ip.length; m++) {
          if (m != (temp_ip.length - 1 )) {

            // var edgeID = temp_ip[m] + "to" + temp_ip[m + 1];
            var edgeID = Math.random();

            if (CytoscapeService_Bandwidth.getGraph().elements('edge[id = "' + edgeID + '"]').size() == 0) {

              CytoscapeService_Bandwidth.add_edge(edgeID, temp_ip[m], temp_ip[m + 1], temp_rtt[m], null, null, startNode, destinationNode, metadataKey);

              CytoscapeService_Bandwidth.getGraph().on('tap', 'edge[id = "' + edgeID + '"]', function (event) {
                var element = event.cyTarget;
                //ID: element.id()
                //metadataKey: element.data().metadataKey


                // search for ALL edges with same metadata, make it red, make everything else the same.
                CytoscapeService_Bandwidth.getGraph().style().selector("edge").style({
                  'line-color': '#a8ea00',
                  'width': 2
                }).update();

                CytoscapeService_Bandwidth.getGraph().style()
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

        if (CytoscapeService_Bandwidth.getGraph().elements('edge[id = "' + edgeID + '"]').size() == 0) {

          CytoscapeService_Bandwidth.add_edge(edgeID, startNode, reversedResponse[j]['val'][0]['ip'], temp_rtt[m], null, null, startNode, destinationNode, metadataKey);

          CytoscapeService_Bandwidth.getGraph().on('tap', 'edge[id = "' + edgeID + '"]', function (event) {
            var element = event.cyTarget;
            $log.debug("Element METADATA: " + element.data().metadataKey)
            CytoscapeService_Bandwidth.getGraph().style().selector("edge").style({
              'line-color': '#a8ea00',
              'width': 2
            }).update();

            CytoscapeService_Bandwidth.getGraph().style()
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
      var node = CytoscapeService_Bandwidth.getGraph().elements('[id = "' + response[i].ip + '"]');
      node.data({
        label: response[i].ip + "\n" + response[i].city + ", " + response[i].countrycode
      });


    }

    //Style Options
    CytoscapeService_Bandwidth.getGraph().style()
    // .selector('#203.30.39.127')
    // .selector(':selected')
    // .selector('[id = "203.30.39.127"]')
      .selector('node[mainNode = "true"]')
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

    CytoscapeService_Bandwidth.getGraph().layout(layoutOptions);


  }).catch(function (error) {
    $log.debug("TracerouteController:bw_cytoscape")
    $log.debug("Server Response: " + error.status);

  });


  // function populateGraph(promises, startNode, destinationNode) {
  //
  //   $q.all(promises).then(function (response) {
  //     // console.log("Last Then, START NODE: " + start);
  //     // console.log("Last Then, END NODE: " + end);
  //
  //     for (var i = 0; i < response.length; i++) {
  //
  //       var reversedResponse = response[i].data;
  //
  //       for (var j = 0; j < reversedResponse.length; j++) {
  //         $scope.tracerouteTime = UnixTimeConverterService.getDate(reversedResponse[j]['ts']);
  //         $scope.tracerouteDate = UnixTimeConverterService.getTime(reversedResponse[j]['ts']);
  //
  //         var temp_ip = [];
  //         var temp_rtt = [];
  //
  //         for (var k = 0; k < reversedResponse[j]['val'].length; k++) {
  //           if (reversedResponse[j]['val'][k]['query'] == 1) {
  //             temp_ip.push(reversedResponse[j]['val'][k]['ip']);
  //             temp_rtt.push(reversedResponse[j]['val'][k]['rtt']);
  //           }
  //         }
  //
  //         // Adding Nodes
  //         for (var m = 0; m < temp_ip.length; m++) {
  //           if (CytoscapeService_Bandwidth.getGraph().elements('node[id = "' + temp_ip[m] + '"]').size() == 0) {
  //             CytoscapeService_Bandwidth.add_node(temp_ip[m], false);
  //           }
  //         }
  //
  //         // Adding edges
  //         for (var m = 0; m < temp_ip.length; m++) {
  //           if (m != (temp_ip.length - 1 )) {
  //             var edgeID = temp_ip[m] + "to" + temp_ip[m + 1];
  //             if (CytoscapeService_Bandwidth.getGraph().elements('edge[id = "' + edgeID + '"]').size() == 0) {
  //               CytoscapeService_Bandwidth.add_edge(edgeID, temp_ip[m], temp_ip[m + 1], temp_rtt[m], null, null, startNode, destinationNode);
  //             }
  //           }
  //         }
  //
  //         // Add Edge for main node
  //         var edgeID = startNode + "to" + reversedResponse[j]['val'][0]['ip'];
  //         if (CytoscapeService_Bandwidth.getGraph().elements('edge[id = "' + edgeID + '"]').size() == 0) {
  //           CytoscapeService_Bandwidth.add_edge(edgeID, startNode, reversedResponse[j]['val'][0]['ip'], temp_rtt[m], null, null, startNode, destinationNode);
  //         }
  //
  //         // Break so that we grab only the latest traceroute path
  //         break;
  //       }
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
  //   })
  // }

}]);

traceroute.controller('updateBandwidth', ['$scope', '$http', '$q', '$log', 'HostService', 'CytoscapeService_Bandwidth', 'UnixTimeConverterService', function ($scope, $http, $q, $log, HostService, CytoscapeService_Bandwidth, UnixTimeConverterService) {


  var host1 = HostService.getHost();

  // Option1. For each edge, get BW of parentNode/DestinationNode
  // Option2. Get all BW, loop through edge, get all similar.


  // ng-click - click event.
  $scope.getBandwidth = function () {

    $http({
      method: 'GET',
      url: host1,
      params: {
        'format': 'json',
        'event-type': 'throughput',
        // 'limit': 10,
        // 'time-end': (Math.floor(Date.now() / 1000)),
        'time-range': 86400
      },
      cache: false
    }).then(function (response) {

      for (var i = 0; i < response.data.length; i++) {
        var promises = []
        var startNode = response.data[i]['source'];
        var destinationNode = response.data[i]['destination'];

        for (var j = 0; j < response.data[i]['event-types'].length; j++) {
          if (response.data[i]['event-types'][j]['event-type'] == 'throughput') {

            // Assuming that there are unique BW destination.

            for (var k = 0; k < response.data[i]['event-types'][j]['summaries'].length; k++) {

              var bw_summary_url = response.data[i]['url'] + "/throughput/averages/" + response.data[i]['event-types'][j]['summaries'][k]['summary-window'];

              var promise = $http({
                method: 'GET',
                url: bw_summary_url,
                params: {
                  'format': 'json',
                  // 'limit': '2',
                  // 'time-end': (Math.floor(Date.now() / 1000)),
                  'time-range': response.data[i]['event-types'][j]['summaries'][k]['summary-window']
                  //48 Hours = 172800
                  // 24 hours = 86400
                },
                cache: false
              });

              promises.push(promise);
            }
            updateBWGraph(promises, startNode, destinationNode);

          }
        }


      }

    });


  }

  function updateBWGraph(promises, startNode, destinationNode) {
    $q.all(promises).then(function (response) {
      //String
      var edges = CytoscapeService_Bandwidth.getGraph().elements('edge[startNode = "' + startNode + '"][endNode = "' + destinationNode + '"]');
      // var edges = CytoscapeService_Bandwidth.getGraph().elements('edge[startNode = ' + startNode + '][endNode = ' + destinationNode + ']');

      console.log("Edges Size: " + edges.size());
      var ts;
      var bw;

      // Becareful, bw/ts is being replaced.
      for (var i = 0; i < response.length; i++) {
        var reversedResponse = response[i].data;
        for (var k = 0; k < reversedResponse.length; k++) {

          ts = reversedResponse[k]['ts'];
          bw = reversedResponse[k]['val']

        }
      }

      for (var k = 0; k < edges.size(); k++) {

        // Need to check whether bw is double or string
        edges[k].data({
          bandwidth: bw
        });

      }


      CytoscapeService_Bandwidth.getGraph().layout();


    });

  }


}]);

traceroute.controller('LatencyVisualisationCtrl', ['$scope', '$http', '$q', '$log', 'HostService', 'LatencyCytoscapeService', 'UnixTimeConverterService', 'GeoIPNekudoService', 'UniqueArrayService', 'LatencyMetadataService', function ($scope, $http, $q, $log, HostService, LatencyCytoscapeService, UnixTimeConverterService, GeoIPNekudoService, UniqueArrayService, LatencyMetadataService) {

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
      if (LatencyCytoscapeService.getGraph().elements('node[id = "' + response.data[i]['destination'] + '"]').size() == 0) {
        // $log.debug("Unique Destination Name: " + response.data[i]['destination'])
        LatencyCytoscapeService.add_node(response.data[i]['destination'], false, null, null);
        nodeToIPList.push(response.data[i]['destination']);

        // Event
        LatencyCytoscapeService.getGraph().on('tap', 'node[id = "' + response.data[i]['destination'] + '"]', function (event) {

        });
      }

      //Adding SOURCE nodes into visualisation
      if (LatencyCytoscapeService.getGraph().elements('node[id = "' + response.data[i]['source'] + '"]').size() == 0) {
        // $log.debug("Unique Source Name: " + response.data[i]['source'])
        LatencyCytoscapeService.add_node(response.data[i]['source'], true, response.data[i]['source'], response.data[i]['destination']);
        nodeToIPList.push(response.data[i]['source']);

        // Event
        LatencyCytoscapeService.getGraph().on('tap', 'node[id = "' + response.data[i]['source'] + '"]', function (event) {

        });

      } else {
        //update it to be source node as well.
        LatencyCytoscapeService.getGraph().elements('node[id = "' + response.data[i]['source'] + '"]').data({
          mainNode: "true"
        });
      }

      //Adding EDGES for SOURCE and DESTINATION
      if (LatencyCytoscapeService.getGraph().elements('edge[id = "' + response.data[i]['metadata-key'] + '"]').size() == 0) {

        // $log.debug("Unique Destination Name: " + response.data[i]['destination'])
        LatencyCytoscapeService.add_edge(response.data[i]['metadata-key'], response.data[i]['source'], response.data[i]['destination'], null, null, null, response.data[i]['source'], response.data[i]['destination'], response.data[i]['metadata-key']);

        // Event
        LatencyCytoscapeService.getGraph().getElementById(response.data[i]['metadata-key']).on('tap', function (event) {
          var element = event.cyTarget;
          // console.log(element.data().metadataKey)

          LatencyMetadataService.setMetadata(element.data().metadataKey)

          LatencyMetadataService.setTracerouteGraph(element.data().startNode, element.data().endNode);

          // Style Options
          LatencyMetadataService.getGraph().style()
            .selector('node[mainNode = "true"]')
            .style({
              'background-color': 'DimGray'
            }).update();

          // window.dispatchEvent(new Event('resize'));


          $scope.$apply(function () {

            // $scope.showLatencyInfo = true;
            $scope.latencyDate = UnixTimeConverterService.getDate(element.data().latencyTime);
            $scope.latencyTime = UnixTimeConverterService.getTime(element.data().latencyTime);

            // $scope.latencyMetadata = element.data().metadataKey;

            $scope.$broadcast('LatencyMetadata', element.data().metadataKey);

          });


          // search for ALL edges with same metadata, make it GreenYellow, make everything else the same.
          LatencyCytoscapeService.getGraph().style().selector("edge").style({
            'line-color': 'GreenYellow',
            'width': 2
          }).update();

          LatencyCytoscapeService.getGraph().style()
          // .selector('#203.30.39.127')
          // .selector(':selected')
          // .selector('[id = "203.30.39.127"]')
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

        var edge = LatencyCytoscapeService.getGraph().elements('edge[startNode = "' + startNode + '"][endNode = "' + destinationNode + '"]');
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
      var node = LatencyCytoscapeService.getGraph().elements('[id = "' + response[i].ip + '"]');
      node.data({
        label: response[i].ip + "\n" + response[i].city + ", " + response[i].countrycode
      });

    }

    //Style Options
    LatencyCytoscapeService.getGraph().style()
    // .selector('#203.30.39.127')
    // .selector(':selected')
    // .selector('[id = "203.30.39.127"]')
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

    LatencyCytoscapeService.getGraph().layout(layoutOptions);


  }).catch(function (error) {
    $log.debug("TracerouteController:LatencyVisualisationCtrl ERROR:")
    $log.debug(error);
    $log.debug("Server Response: " + error.status);

  });


}]);


traceroute.controller('LatencyInformationCtrl', ['$scope', '$http', '$q', '$log', 'HostService', 'LatencyToTracerouteCytoscapeService', 'UnixTimeConverterService', 'LatencyMetadataService', function ($scope, $http, $q, $log, HostService, LatencyToTracerouteCytoscapeService, UnixTimeConverterService, LatencyMetadataService) {

  $log.debug("LatencyInformationCtrl:START");

  //To allow Cytoscape graph to load upon showing/hiding.
  //window.dispatchEvent(new Event('resize'));
  var host = HostService.getHost();

  $scope.$on('LatencyMetadata', function (event, metadata) {


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
      $log.debug("LatencyInformationCtrl: ERROR")
      $log.debug(error);
      $log.debug("Server Response: " + error.status);

    });

  });

  $scope.loadLatencySummaryChart = function (URL, event_type, summary_type, summary_window, uri) {

    $log.debug("LatencyInformationCtrl: loadLatencySummaryChart " + uri);

    // var latencyURL = response.data[i]['url'] + "histogram-rtt/" + response.data[i]['event-types'][j]['summaries'][k]['summary-type'] + "/" + response.data[i]['event-types'][j]['summaries'][k]['summary-window']

    if(summary_type=="aggregation"){
      var individualLatencyResultsURL = URL + event_type + "/" + summary_type + "s/" + summary_window;
    }else{
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

      $scope.IndividualLatencyResults = [];
      // var reversedResponse = response.data.reverse();
      var reversedResponse = response.data;

      for (var i = 0; i < reversedResponse.length; i++) {
        var labels = [];
        var values = [];

        reversedResponse[i]['val'].s

        angular.forEach(reversedResponse[i]['val'], function(value, key) {

          labels.push(key);
          values.push(value);

        });

        $log.debug(labels);
        $log.debug(values);
        // for (var j = 0; j <  reversedResponse[i]['val'].length; j++) {
        //
        //
        // }


        $scope.IndividualLatencyResults.push({
          time: UnixTimeConverterService.getTime(reversedResponse[i]['ts']),
          date: UnixTimeConverterService.getDate(reversedResponse[i]['ts']),
          label:labels,
          data : values

          // type: response.data['event-types'][j]['summaries'][k]['summary-type'],
          // uri: response.data['event-types'][j]['summaries'][k]['uri'],
          //
          // window: response.data['event-types'][j]['summaries'][k]['summary-window'],
          // url: response.data['url'],
          // event_type: response.data['event-types'][j]['event-type']

        });



        $scope.IndividualLatencyResultIndex = 0;

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

traceroute.controller('LatencyVisualisation_DisplayOptionsCtrl', ['$scope', '$http', '$q', '$log', 'HostService', 'LatencyCytoscapeService', 'UnixTimeConverterService', function ($scope, $http, $q, $log, HostService, LatencyCytoscapeService, UnixTimeConverterService) {

  $scope.displayBreathFirst = function () {

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

    LatencyCytoscapeService.getGraph().layout(options);
  }

  $scope.displayConcentric = function () {

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

    LatencyCytoscapeService.getGraph().layout(options);

  }

  $scope.displayGrid = function () {
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

    LatencyCytoscapeService.getGraph().layout(options);

  }

  $scope.displayCose = function () {

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

    LatencyCytoscapeService.getGraph().layout(options);

  }

  $scope.displayCircle = function () {

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

    LatencyCytoscapeService.getGraph().layout(options);

  }


}]);


traceroute.controller('testController', ['$scope', '$log', 'AnalyzeTraceroute', 'GeoIPNekudoService', function ($scope, $log, AnalyzeTraceroute, GeoIPNekudoService) {


  $scope.analyzetr = function () {

    // var xxx;
    // var xxx = GeoIPNekudoService.getCoordinates("128.180.80.74");
    // $log.debug(xxx);

    // console.log("Caller: ")
    //
    //
    // AnalyzeTraceroute.getAnalyzation().then(function (response) {
    //   console.log(response)
    //   $log.debug("MIN String?: " + (response[0]['nodes']['rttMin']))
    //   //0.074
    //   $log.debug("MIN String?: " + angular.isString(response[0]['nodes']['rttMin']))
    //
    // });


  }


}]);

//
// traceroute.controller('traceroute_visjs', ['$scope', '$http', 'TracerouteMainResults', function ($scope, $http, TracerouteMainResults) {
//
//
//   var vis_nodes = [];
//   var vis_edges = [];
//   var host1 = "http://ps2.jp.apan.net/esmond/perfsonar/archive/";
//
//
//   $http({
//     method: 'GET',
//     url: host1,
//     params: {
//       'format': 'json',
//       'event-type': 'packet-trace',
//       'time-end': (Math.floor(Date.now() / 1000)),
//       'limit': 1,
//       'time-range': 86400
//     }
//   }).then(function successCallback(response) {
//
//     console.log("First $http Success");
//
//     for (var i = 0; i < response.data.length; i++) {
//
//       // console.log("Node Size: " + cytoscape_nodes.length)
//
//       cytoscape_nodes.push(add_node(response.data[i]['source']));
//
//       var mainForLoopCounter = i;
//
//       for (var j = 0; j < response.data[i]['event-types'].length; j++) {
//         if (response.data[i]['event-types'][j]['event-type'] == 'packet-trace') {
//
//           $http({
//             method: 'GET',
//             url: response.data[i]['url'] + "packet-trace/base",
//             params: {'format': 'json', 'limit': '1', 'time-end': (Math.floor(Date.now() / 1000))}
//           }).then(function successCallback(response2) {
//             console.log("Second $http Success");
//             //console.log(response2.data[0]['ts']);
//
//             for (var k = 0; k < response2.data.length; k++) {
//               var ts = response2.data[k]['ts'];
//               // console.log("TS: " + ts);
//
//               // Main Node
//               cytoscape_edges.push(add_edge(Math.random(), response.data[mainForLoopCounter]['source'], response2.data[k]['val'][0]['ip'], Math.random()));
//
//
//               var temp_ip = [];
//               for (var l = 0; l < response2.data[k]['val'].length; l++) {
//                 if (response2.data[k]['val'][l]['query'] == 1) {
//                   temp_ip.push(response2.data[k]['val'][l]['ip']);
//                 }
//               }
//
//               // Adding Nodes and Edges
//               for (var m = 0; m < temp_ip.length; m++) {
//                 cytoscape_nodes.push(add_node(temp_ip[m]));
//                 if (m != (temp_ip.length - 1 )) {
//                   cytoscape_edges.push(add_edge(Math.random(), temp_ip[m], temp_ip[m + 1], 100000));
//                 }
//               }
//
//
//             }
//
//
//             cy.add(cytoscape_nodes);
//             cy.add(cytoscape_edges);
//
//             var layout = cy.makeLayout({
//               name: 'concentric',
//               concentric: function (node) {
//                 return node.degree();
//               },
//               levelWidth: function (nodes) {
//                 return 2;
//               }
//             });
//             layout.run();
//
//             cy.style()
//               .selector('node[startNode = "1"]')
//               .style({
//                 'background-color': 'yellow'
//               })
//
//               .update();
//
//           }, function errorCallback(response2) {
//             console.log("Second $http error: " + response2);
//           });
//
//
//         }
//       }
//     }
//
//
//   }, function errorCallback(response) {
//     console.log("First $http error: " + response);
//   });
//
//
//   // ng-click - click event.
//   $scope.updateGraph = function () {
//     if (!angular.isUndefined($scope.input_node1)) {
//       //host1 = $scope.input_node1;
//       console.log("Host1: " + host1);
//
//
//     } else {
//       alert("Undefined");
//     }
//
//
//   }
//
//   // Get Current Time in seconds: Date.now()/1000 and floor it.
//
//   $scope.getYear = function () {
//     // Do something here
//     //Call this from the main page as {{getYear()}}
//   }
//
//
//   // TracerouteResultIndividual.get({metadata_key: '8662af9e72fb46228ce307534bba5a7f'}, function (data) {
//   //
//   //   for (i = 0; i < data[0].val.length; i++) {
//   //     if (previousIP != data[0].val[i].ip) {
//   //       //console.log(data[0].val[i].ip)
//   //
//   //       cy.add({
//   //           group: "nodes",
//   //           data: {
//   //
//   //             id: data[0].val[i].ip
//   //           }
//   //         }
//   //       );
//   //
//   //       previousIP = data[0].val[i].ip
//   //     }
//   //   }
//   //
//   //
//   // });
//
//
// }]);
//

// traceroute.controller('ipAddrDecoderController', ['$scope', 'GEOIP_NEKUDO', function ($scope, GEOIP_NEKUDO) {
//   $scope.ip_address
//
//   GEOIP_NEKUDO.decode({ip_address: '192.30.252.129'}, function (data) {
//     //$scope.latitude = data.latitude;
//     //$scope.longitude = data.longitude;
//     $scope.latitude = data.location.latitude;
//     $scope.longitude = data.location.longitude;
//
//   });
//
//
//
//
//
// }]);

