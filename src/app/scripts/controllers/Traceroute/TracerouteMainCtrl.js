/**
 * Created by Nazri on 24/2/16.
 */
// NOTE: App name CANNOT be in capitalized letters
// NOTE: Might want to separate tracerouteController.js out


// This has to match with ng-app="traceroute" on HTML page
var traceroute = angular.module('traceroute', ['TracerouteServices', 'IPAddrDecodeServices', 'GeneralServices', 'uiGmapgoogle-maps']).config(['uiGmapGoogleMapApiProvider', function (GoogleMapApiProviders) {
  GoogleMapApiProviders.configure({
    key: 'AIzaSyBgSYT0qquQTzCZrnHL_Tkos7m1pSsA92A',
    v: '3.20', //defaults to latest 3.X anyhow
    libraries: 'weather,geometry,visualization'
  });
}])

// NOTE. Built in modules with $ should be declared first.

traceroute.controller('tr_gmaps', ['$scope', '$http', '$q', 'TracerouteMainResults', 'GEOIP_NEKUDO', 'uiGmapGoogleMapApi', function ($scope, $http, $q, TracerouteMainResults, GEOIP_NEKUDO, uiGmapGoogleMapApi) {

  // Do stuff with your $scope.
  // Note: Some of the directives require at least something to be defined originally!
  // e.g. $scope.markers = []

  // uiGmapGoogleMapApi is a promise.
  // The "then" callback function provides the google.maps object.

  var nodes = [];
  var edges = [];
  var host1 = "http://ps2.jp.apan.net/esmond/perfsonar/archive/";


  $scope.map = {
    center: {
      latitude: 1.345468,
      longitude: 103.956101
    }, zoom: 8, pan: false
  };
  $scope.options = {
    scrollwheel: true
  };
  $scope.marker = {key: 1, coords: {latitude: 45, longitude: -73}};


  var markers = [];

  markers.push(
    {
      id: "first",
      latitude: 1.564836,
      longitude: 103.718025,
      title: "Hello1",
      options: {labelClass: 'marker_labels', labelAnchor: '12 60', labelContent: 'm1'}

    }
  );
  markers.push(
    {
      id: "second",
      latitude: 1.512557,
      longitude: 104.168110,

    }
  );


  // $scope.randomMarkers = markers;
  //
  //
  // $scope.randomLines = [
  //
  //   {
  //     id: 1,
  //     geotracks: [{
  //       latitude: 1.564836,
  //       longitude: 103.718025
  //     }, {
  //       latitude: 1.512557,
  //       longitude: 104.168110
  //     }],
  //     stroke: {
  //       color: '#6060FB',
  //       weight: 1
  //     }
  //   }, {
  //     id: 2,
  //     geotracks: [{
  //       latitude: 24.0,
  //       longitude: 72.58
  //     }, {
  //       latitude: 23.1,
  //       longitude: 71.58
  //     }]
  //   }];


  uiGmapGoogleMapApi.then(function (maps) {
    console.log("Inside GoogleMaps Then");

  });

  $scope.getNodes = $http({
    method: 'GET',
    url: host1,
    params: {'format': 'json', 'event-type': 'packet-trace', 'time-end': (Math.floor(Date.now() / 1000)), 'limit': '1'}
  }).then(function successCallback(response) {
    console.log("First $http Success");

    for (var i = 0; i < response.data.length; i++) {
      var parentIP = response.data[i]['source'];
      var mainForLoopCounter = i;

      addNode(response.data[i]['source'], response.data[i]['source']);

      for (var j = 0; j < response.data[i]['event-types'].length; j++) {
        if (response.data[i]['event-types'][j]['event-type'] == 'packet-trace') {

          $http({
            method: 'GET',
            url: response.data[i]['url'] + "packet-trace/base",
            params: {'format': 'json', 'limit': '1', 'time-end': (Math.floor(Date.now() / 1000))}
          }).then(function successCallback(response2) {
            console.log("Second $http Success");
            //console.log(response2.data[0]['ts']);

            for (var k = 0; k < response2.data.length; k++) {
              var ts = response2.data[k]['ts'];
              // console.log("TS: " + ts);

              // Main Node
              // cytoscape_edges.push(add_edge(Math.random(), response.data[mainForLoopCounter]['source'] ,response2.data[k]['val'][0]['ip'], Math.random()));
              addEdge(Math.random(), response.data[mainForLoopCounter]['source'], response2.data[k]['val'][0]['ip'], 1);

              var temp_ip = [];
              for (var l = 0; l < response2.data[k]['val'].length; l++) {
                if (response2.data[k]['val'][l]['query'] == 1) {
                  temp_ip.push(response2.data[k]['val'][l]['ip']);
                }
              }

              // Adding Nodes and Edges
              for (var m = 0; m < temp_ip.length; m++) {
                // cytoscape_nodes.push(add_node(temp_ip[m]));
                addNode(temp_ip[m], temp_ip[m]);
                if (m != (temp_ip.length - 1 )) {
                  // cytoscape_edges.push(add_edge(Math.random(), temp_ip[m], temp_ip[m + 1],100000));
                  addEdge(Math.random(), temp_ip[m], temp_ip[m + 1], 1);
                }
              }

            }

          }, function errorCallback(response2) {
            console.log("Second $http error: " + response2);
          });


        }
      }
    }

  }, function errorCallback(response) {
    console.log("First $http error: " + response);
  });


  $q.all([$scope.getNodes]).then(function (values) {


  });
  for (var i = 0; i < nodes.length; i++) {
    GEOIP_NEKUDO.decode({ip_address: nodes[i].id}, function (decoded_ip) {
      nodes[i].latitude = decoded_ip.location.latitude;
      nodes[i].longitude = decoded_ip.location.longitude;
      console.log("Latitude: " + decoded_ip.location.latitude);
    });
  }

  // for (var i = 0; i < edges.length; i++) {
  //   GEOIP_NEKUDO.decode({ip_address: edges[i].id}, function (decoded_ip) {
  //     edges[i].latitude = decoded_ip.location.latitude;
  //     edges[i].longitude = decoded_ip.location.longitude;
  //
  //
  //   });
  // }


  function addNode(id, title) {
    if (nodes.length > 0) {
      var hasDuplicates = false;
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].id == id) {
          hasDuplicates = true;
        }
      }

      if (hasDuplicates == false) {
        nodes.push(
          {
            id: id,
            latitude: 0,
            longitude: 0,
            title: title,
            options: {labelClass: 'marker_labels', labelAnchor: '12 60', labelContent: 'm1'}

          });

      }
    } else {
      nodes.push(
        {
          id: id,
          latitude: 0,
          longitude: 0,
          title: title,
          options: {labelClass: 'marker_labels', labelAnchor: '12 60', labelContent: 'm1'}

        });

    }

  }

  function addEdge(id, source, target, weight) {

    edges.push(
      {
        id: id,
        geotracks: [{
          latitude: source,
          longitude: 0
        }, {
          latitude: target,
          longitude: 0
        }],
        stroke: {
          color: '#6060FB',
          weight: weight
        }
      }
    )

  }

  $scope.nodeMarkers = nodes;
  $scope.edgeLines = edges;

  //  var maps = new GMaps({
  //   div: '#maps',
  //   lat: 37.8668,
  //   lng: -122.2536,
  //   width: 'max-width',
  //   height: '700px',
  //   zoom: 12,
  //   zoomControl: true,
  //   zoomControlOpt: {
  //     style: 'SMALL',
  //     position: 'TOP_LEFT'
  //   },
  //   panControl: false
  // });

  //$scope.maps="<div id='maps'></div>"

  // TracerouteResults.get({ metadata_key: '0171dee126dd433e817e21ca352bc517' }, function(data) {
  //   //$scope.route_time = data[0].ts;
  //   //for (i = 0; i < data[0].val.length; i++) {
  //   //  console.log(data[0].val[i].ip)
  //   //}
  //
  //
  //   angular.forEach(data[0].val, function (item) {
  //
  //     if (previousIP != item.ip){
  //       counter++
  //
  //       //console.log(item.ip)
  //
  //       GEOIP_NEKUDO.decode({ ip_address: item.ip }, function(decoded_ip) {
  //         latitude = decoded_ip.location.latitude
  //         longitude = decoded_ip.location.longitude
  //
  //         maps.setCenter(latitude, longitude)
  //
  //
  //         //console.log(counter)
  //         if (counter==1){
  //          //w console.log(latitude)
  //           firstLat=latitude
  //           firstLon=longitude
  //         }
  //
  //
  //         plottingPath.push([latitude, longitude])
  //
  //
  //
  //           //maps.drawOverlay({
  //           //  lat: latitude,
  //           //  lng: longitude,
  //           //  content: '<div class="overlay">'+decoded_ip.city+'</div>'
  //           //});
  //
  //         maps.addMarker({
  //           lat: latitude,
  //           lng: longitude,
  //           infoWindow: {
  //             content: '<p>TTL #: '+ item.ttl + '</p>'
  //           }
  //
  //
  //         });
  //         // FIXME: plottingPath initialized to zero when it's outside this function. Had to draw in here.
  //         // Look into it and fix it
  //         maps.drawPolyline({
  //           path: plottingPath,
  //           strokeColor: '#131540',
  //           strokeOpacity: 0.6,
  //           strokeWeight: 3
  //         });
  //
  //
  //       });
  //
  //       console.log(plottingPath.length)
  //       previousIP = item.ip
  //     }
  //
  //
  //
  //   })
  //
  //
  // });

  //plottingPath.push("x")

  // plottingPath = [[37.7697, -122.3933], [-12.05449279282314, -77.03024273281858], [-12.055122327623378, -77.03039293652341], [-12.075917129727586, -77.02764635449216], [-12.07635776902266, -77.02792530422971], [-12.076819390363665, -77.02893381481931], [-12.088527520066453, -77.0241058385925], [-12.090814532191756, -77.02271108990476]];

  //   maps.drawPolyline({
  //   path: plottingPath,
  //   strokeColor: '#131540',
  //   strokeOpacity: 0.6,
  //   strokeWeight: 6
  // });


}]);

traceroute.controller('tr_d3', ['$scope', 'TracerouteMainResults', function ($scope, TracerouteMainResults) {

  var previousIP, nodes = [], links = []
  var width = 960, height = 500;

  //var nodes = [
  //  { x:   width/3, y: height/2 },
  //  { x: 2*width/3, y: height/2 },
  //  { x: 3*width/3, y: height/2 }
  //];
  //
  //var links = [
  //  { source: 0, target: 1 },
  //  { source: 1, target: 2 }
  //];

  TracerouteResults.get({metadata_key: '8662af9e72fb46228ce307534bba5a7f'}, function (data) {

    for (i = 0; i < data[0].val.length; i++) {
      if (previousIP != data[0].val[i].ip) {
        //console.log(data[0].val[i].ip)
        nodes.push({x: i * width / 3, y: height / 2})
        previousIP = data[0].val[i].ip
      }
    }
    for (i = 0; i < nodes.length; i++) {
      if (i != (nodes.length - 1)) {
        links.push({source: i, target: (i + 1)})
      }
    }

    //links.push({ source: 0, target: (1) })
    //links.push({ source: 1, target: (2) })
    //links.push({ source: 2, target: (3) })
    //links.push({ source: 3, target: (4) })
    //links.push({ source: 4, target: (5) })
    //links.push({ source: 5, target: (6) })
    //links.push({ source: 6, target: (7) })
    //links.push({ source: 7, target: (8) })
    //links.push({ source: 8, target: (9) })
    //links.push({ source: 9, target: (10) })
    //links.push({ source: 10, target: (11) })
    //links.push({ source: 11, target: (12) })


    //console.log("Node Size: "+ nodes.length)
    //console.log("Edge Size: " + links.length)
    //
    //links.forEach(function(entry) {
    //  console.log("Link: Source: "+entry.source + " Target: "+ entry.target);
    //});
    //
    //nodes.forEach(function(entry) {
    //  console.log("Node: X: "+entry.x + " Y: "+ entry.y);
    //});


    var svg = d3.select("#d3fgraph").append("svg")
      .attr("width", width)
      .attr("height", height);


    var force = d3.layout.force()
      .size([width, height])
      .nodes(nodes)
      .links(links);

    force.linkDistance(width / 2);

    var link = svg.selectAll('.link')
      .data(links)
      .enter().append('line')
      .attr('class', 'link');

    var node = svg.selectAll('.node')
      .data(nodes)
      .enter().append('circle')
      .attr('class', 'node');


    force.on('end', function () {

      node.attr('r', width / 25)
        .attr('cx', function (d) {
          return d.x;
        })
        .attr('cy', function (d) {
          return d.y;
        });


      link.attr('x1', function (d) {
        return d.source.x;
      })
        .attr('y1', function (d) {
          return d.source.y;
        })
        .attr('x2', function (d) {
          return d.target.x;
        })
        .attr('y2', function (d) {
          return d.target.y;
        });

    });

    force.start();


  });


}]);


traceroute.controller('tr_cytoscape', ['$scope', '$http', 'TracerouteMainResults', 'UnixTimeConverterService', function ($scope, $http, TracerouteMainResults, UnixTimeConverterService) {


  var cytoscape_nodes = [];
  var cytoscape_edges = [];
  var host1 = "http://ps2.jp.apan.net/esmond/perfsonar/archive/";
  var time_range = 1;

  var cy = cytoscape({
    container: document.getElementById('tr_plot_cytoscape'),

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
          'line-color': '#a8ea00',
          'target-arrow-color': 'black',
          'target-arrow-shape': 'triangle'
        }
      }
    ],

  });

  //   var elements = [ // list of graph elements to start with
  //     { // node a
  //       data: { id: 'a' }
  //     },
  //     { // node b
  //       data: { id: 'c' }
  //     },
  //     { // edge ab
  //       data: { id: 'ab', source: 'a', target: 'b' }
  //     }
  //   ];
  //
  // elements.push (
  //   { // node a
  //     data: { id: 'a' }
  //   }
  //
  // )

  // cy.add(elements)

  // var cy = cytoscape({
  //
  //   container: document.getElementById('tr_plot_cytoscape'), // container to render in
  //
  //   elements: [ // list of graph elements to start with
  //     { // node a
  //       data: { id: 'a' }
  //     },
  //     { // node b
  //       data: { id: 'b' }
  //     },
  //     { // edge ab
  //       data: { id: 'ab', source: 'a', target: 'b' }
  //     }
  //   ],
  //
  //   // style: [ // the stylesheet for the graph
  //   //   {
  //   //     selector: 'node',
  //   //     style: {
  //   //       'background-color': '#666',
  //   //       'label': 'data(id)'
  //   //     }
  //   //   },
  //   //
  //   //   {
  //   //     selector: 'edge',
  //   //     style: {
  //   //       'width': 3,
  //   //       'line-color': '#ccc',
  //   //       'target-arrow-color': '#ccc',
  //   //       'target-arrow-shape': 'triangle'
  //   //     }
  //   //   }
  //   // ],
  //
  //   // layout: {
  //   //   name: 'grid',
  //   //   rows: 1
  //   // }
  //
  // });


  $http({
    method: 'GET',
    url: host1,
    params: {
      'format': 'json',
      'event-type': 'packet-trace',
      // 'limit': 1000,
      // 'time-end': (Math.floor(Date.now() / 1000)),
      'time-range': 86400
    }
  }).then(function successCallback(response) {

    console.log("$http: First Traceroute Call");

    for (var i = 0; i < response.data.length; i++) {
      // console.log("Node Size: " + cytoscape_nodes.length)


      cytoscape_nodes.push(add_node(response.data[i]['source'], true));

      // var parentIP = response.data[i]['source'];
      var mainForLoopCounter = i;

      for (var j = 0; j < response.data[i]['event-types'].length; j++) {
        if (response.data[i]['event-types'][j]['event-type'] == 'packet-trace') {

          $http({
            method: 'GET',
            url: response.data[i]['url'] + "packet-trace/base",
            params: {
              'format': 'json',
              // 'limit': '2',
              // 'time-end': (Math.floor(Date.now() / 1000)),
              'time-range': 86400
            }
          }).then(function successCallback(response2) {

            console.log("$http: Second Traceroute Call");
            //console.log(response2.data[0]['ts']);

            // bmlService.passData(data);

            // $http({
            //   method: 'GET',
            //   url: '/someUrl'
            // }).then(function successCallback(response) {
            //
            // }, function errorCallback(response) {
            //
            // });

            var reversedResponse = response2.data.reverse();


            // May not need to loop. can access array directly, display size to user.

            for (var k = 0; k < reversedResponse.length; k++) {
              $scope.tracerouteTime = UnixTimeConverterService.getDate(reversedResponse[k]['ts']);
              $scope.tracerouteDate = UnixTimeConverterService.getTime(reversedResponse[k]['ts']);

              // Main Node
              var edgeID = response.data[mainForLoopCounter]['source'] + "to" + reversedResponse[k]['val'][0]['ip'];
              cytoscape_edges.push(add_edge(edgeID, response.data[mainForLoopCounter]['source'], reversedResponse[k]['val'][0]['ip'], Math.random()));

              var temp_ip = [];
              for (var l = 0; l < reversedResponse[k]['val'].length; l++) {
                if (reversedResponse[k]['val'][l]['query'] == 1) {
                  temp_ip.push(reversedResponse[k]['val'][l]['ip']);
                }
              }

              // Adding Nodes and Edges
              for (var m = 0; m < temp_ip.length; m++) {
                cytoscape_nodes.push(add_node(temp_ip[m], false));
                if (m != (temp_ip.length - 1 )) {
                  var edgeID = temp_ip[m] + "to" + temp_ip[m + 1];
                  cytoscape_edges.push(add_edge(edgeID, temp_ip[m], temp_ip[m + 1], 100000));
                }
              }

              // Break so that we grab only the latest traceroute path
              break;
            }

            cy.add(cytoscape_nodes);
            cy.add(cytoscape_edges);



            //Layout Options
            // cy.makeLayout({
            //   // http://js.cytoscape.org/#layouts
            //   // grid, random, concentric
            //   name: 'random',
            //   concentric: function (node) {
            //     return node.degree();
            //   },
            //   levelWidth: function (nodes) {
            //     return 2;
            //   }
            // }).run();


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


            // var layoutOptions = {
            //   name: 'concentric',
            //
            //   fit: true, // whether to fit the viewport to the graph
            //   padding: 30, // the padding on fit
            //   startAngle: 3 / 2 * Math.PI, // where nodes start in radians
            //   sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
            //   clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
            //   equidistant: false, // whether levels have an equal radial distance betwen them, may cause bounding box overflow
            //   minNodeSpacing: 10, // min spacing between outside of nodes (used for radius adjustment)
            //   boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
            //   avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
            //   height: undefined, // height of layout area (overrides container height)
            //   width: undefined, // width of layout area (overrides container width)
            //   concentric: function( node ){ // returns numeric value for each node, placing higher nodes in levels towards the centre
            //     return node.degree();
            //   },
            //   levelWidth: function( nodes ){ // the variation of concentric values in each level
            //     return nodes.maxDegree() / 4;
            //   },
            //   animate: false, // whether to transition the node positions
            //   animationDuration: 500, // duration of animation in ms if enabled
            //   animationEasing: undefined, // easing of animation if enabled
            //   ready: undefined, // callback on layoutready
            //   stop: undefined // callback on layoutstop
            // };

            cy.layout(layoutOptions);

            //Style Options
            cy.style()
            // .selector('#203.30.39.127')
            // .selector(':selected')
            // .selector('[id = "203.30.39.127"]')
              .selector('node[startNode = "true"]')
              .style({
                'background-color': 'black'
              }).update();


            //cy.elements('node[startNode = "true"]').size();
            //   console.log("HELLOOO!!!: " + cy.elements('node[startNode = "true"]')[1].data('id'))
            $scope.mainNodes = cy.elements('node[startNode = "true"]').size();
            $scope.totalNodes = cy.elements('node').size();
            $scope.$emit("initialized");


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


          }, function errorCallback(response2) {
            console.log("Second $http error: " + response2);
          });

        }
      }
    }

    bandwidthService.getBandwidth();

  }, function errorCallback(response) {
    console.log("First $http error: " + response);
  });


  $scope.$on('initialized', function () {
    console.log("INITIALIZED CALLED");
    // still called multiple times.

    //issue here
  });


  // another method: http://stackoverflow.com/questions/36737213/how-to-access-ajax-response-data-outside-ajax-function-in-angularjs
  var bandwidthService = {
    getBandwidth: function () {

      // alert(cy.elements('node[startNode = "true"]').size());

      // $http({
      //   method: 'GET',
      //   url: '/someUrl'
      // }).then(function successCallback(response) {
      //
      // }, function errorCallback(response) {
      //
      // });
    }
  };

  // ng-click - click event.
  $scope.updateGraph = function () {
    if (!angular.isUndefined($scope.input_node1)) {
      //host1 = $scope.input_node1;
      console.log("Host1: " + host1);

    } else {
      alert("Undefined");
    }


  }


  $scope.getYear = function () {
    // Do something here
    //Call this from the main page as {{getYear()}}
  }

  function add_node(ID, startNode) {

    var mainNode;
    if (startNode) {
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
        startNode: mainNode

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
    return node;
  }

  function add_edge(ID, source, target, bandwidth, latency) {

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
    return edge;
  }

}]);


traceroute.controller('traceroute_visjs', ['$scope', '$http', 'TracerouteMainResults', function ($scope, $http, TracerouteMainResults) {


  var vis_nodes = [];
  var vis_edges = [];
  var host1 = "http://ps2.jp.apan.net/esmond/perfsonar/archive/";


  $http({
    method: 'GET',
    url: host1,
    params: {
      'format': 'json',
      'event-type': 'packet-trace',
      'time-end': (Math.floor(Date.now() / 1000)),
      'limit': 1,
      'time-range': 86400
    }
  }).then(function successCallback(response) {

    console.log("First $http Success");

    for (var i = 0; i < response.data.length; i++) {

      // console.log("Node Size: " + cytoscape_nodes.length)

      cytoscape_nodes.push(add_node(response.data[i]['source']));

      var mainForLoopCounter = i;

      for (var j = 0; j < response.data[i]['event-types'].length; j++) {
        if (response.data[i]['event-types'][j]['event-type'] == 'packet-trace') {

          $http({
            method: 'GET',
            url: response.data[i]['url'] + "packet-trace/base",
            params: {'format': 'json', 'limit': '1', 'time-end': (Math.floor(Date.now() / 1000))}
          }).then(function successCallback(response2) {
            console.log("Second $http Success");
            //console.log(response2.data[0]['ts']);

            for (var k = 0; k < response2.data.length; k++) {
              var ts = response2.data[k]['ts'];
              // console.log("TS: " + ts);

              // Main Node
              cytoscape_edges.push(add_edge(Math.random(), response.data[mainForLoopCounter]['source'], response2.data[k]['val'][0]['ip'], Math.random()));


              var temp_ip = [];
              for (var l = 0; l < response2.data[k]['val'].length; l++) {
                if (response2.data[k]['val'][l]['query'] == 1) {
                  temp_ip.push(response2.data[k]['val'][l]['ip']);
                }
              }

              // Adding Nodes and Edges
              for (var m = 0; m < temp_ip.length; m++) {
                cytoscape_nodes.push(add_node(temp_ip[m]));
                if (m != (temp_ip.length - 1 )) {
                  cytoscape_edges.push(add_edge(Math.random(), temp_ip[m], temp_ip[m + 1], 100000));
                }
              }


            }


            cy.add(cytoscape_nodes);
            cy.add(cytoscape_edges);

            var layout = cy.makeLayout({
              name: 'concentric',
              concentric: function (node) {
                return node.degree();
              },
              levelWidth: function (nodes) {
                return 2;
              }
            });
            layout.run();

            cy.style()
              .selector('node[startNode = "1"]')
              .style({
                'background-color': 'yellow'
              })

              .update();

          }, function errorCallback(response2) {
            console.log("Second $http error: " + response2);
          });


        }
      }
    }


  }, function errorCallback(response) {
    console.log("First $http error: " + response);
  });


  // ng-click - click event.
  $scope.updateGraph = function () {
    if (!angular.isUndefined($scope.input_node1)) {
      //host1 = $scope.input_node1;
      console.log("Host1: " + host1);


    } else {
      alert("Undefined");
    }


  }

  // Get Current Time in seconds: Date.now()/1000 and floor it.

  $scope.getYear = function () {
    // Do something here
    //Call this from the main page as {{getYear()}}
  }


  // TracerouteResultIndividual.get({metadata_key: '8662af9e72fb46228ce307534bba5a7f'}, function (data) {
  //
  //   for (i = 0; i < data[0].val.length; i++) {
  //     if (previousIP != data[0].val[i].ip) {
  //       //console.log(data[0].val[i].ip)
  //
  //       cy.add({
  //           group: "nodes",
  //           data: {
  //
  //             id: data[0].val[i].ip
  //           }
  //         }
  //       );
  //
  //       previousIP = data[0].val[i].ip
  //     }
  //   }
  //
  //
  // });


}]);


// traceroute.controller('ipAddrDecoderController', ['$scope', 'GEOIP_NEKUDO', function($scope, GEOIP_NEKUDO) {
//   $scope.ip_address
//
//   GEOIP_NEKUDO.decode({ ip_address: '192.30.252.129' }, function(data) {
//     //$scope.latitude = data.latitude;
//     //$scope.longitude = data.longitude;
//     $scope.latitude = data.location.latitude;
//     $scope.longitude = data.location.longitude;
//
//   });
//
// }]);

