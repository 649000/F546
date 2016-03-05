/**
 * Created by Nazri on 24/2/16.
 */
// NOTE: App name CANNOT be in capitalized letters
// NOTE: Might want to separate tracerouteController.js out
var maps, plottingPath = new Array(), latitude, longitude, temp


//var jsonURL = 'http://hpc-perfsonar.usc.edu/esmond/perfsonar/archive/?event-type=packet-trace&format=json'
var jsonURL='../../json/hpc-perfsonar.usc.edu.json'


// This has to match with ng-app="traceroute" on HTML page
var traceroute = angular.module('traceroute',['TracerouteServices','IPAddrDecodeServices']);


traceroute.controller('traceroutePlot', ['$scope', 'TracerouteResults','GEOIP_NEKUDO', function($scope, TracerouteResults, GEOIP_NEKUDO) {

  var previousIP = 0, counter= 0, firstLat= 0, firstLon = 0


   maps = new GMaps({
    div: '#maps',
    lat: 37.8668,
    lng: -122.2536,
    width: 'max-width',
    height: '700px',
    zoom: 12,
    zoomControl: true,
    zoomControlOpt: {
      style: 'SMALL',
      position: 'TOP_LEFT'
    },
    panControl: false
  });

  //$scope.maps="<div id='maps'></div>"

  Traceroute_Results.get({ metadata_key: '0171dee126dd433e817e21ca352bc517' }, function(data) {
    //$scope.route_time = data[0].ts;
    //for (i = 0; i < data[0].val.length; i++) {
    //  console.log(data[0].val[i].ip)
    //}


    angular.forEach(data[0].val, function (item) {

      if (previousIP != item.ip){
        counter++

        //console.log(item.ip)

        GEOIP_NEKUDO.decode({ ip_address: item.ip }, function(decoded_ip) {
          latitude = decoded_ip.location.latitude
          longitude = decoded_ip.location.longitude

          maps.setCenter(latitude, longitude)


          //console.log(counter)
          if (counter==1){
           //w console.log(latitude)
            firstLat=latitude
            firstLon=longitude
          }


          plottingPath.push([latitude, longitude])



            //maps.drawOverlay({
            //  lat: latitude,
            //  lng: longitude,
            //  content: '<div class="overlay">'+decoded_ip.city+'</div>'
            //});

          maps.addMarker({
            lat: latitude,
            lng: longitude,
            infoWindow: {
              content: '<p>TTL #: '+ item.ttl + '</p>'
            }


          });
          // FIXME: plottingPath initialized to zero when it's outside this function. Had to draw in here.
          // Look into it and fix it
          maps.drawPolyline({
            path: plottingPath,
            strokeColor: '#131540',
            strokeOpacity: 0.6,
            strokeWeight: 3
          });


        });

        console.log(plottingPath.length)
        previousIP = item.ip
      }



    })


  });

  //plottingPath.push("x")

 // plottingPath = [[37.7697, -122.3933], [-12.05449279282314, -77.03024273281858], [-12.055122327623378, -77.03039293652341], [-12.075917129727586, -77.02764635449216], [-12.07635776902266, -77.02792530422971], [-12.076819390363665, -77.02893381481931], [-12.088527520066453, -77.0241058385925], [-12.090814532191756, -77.02271108990476]];

   maps.drawPolyline({
   path: plottingPath,
   strokeColor: '#131540',
   strokeOpacity: 0.6,
   strokeWeight: 6
 });


}]);

traceroute.controller('traceroutePlot', ['$scope', 'TracerouteResults', function($scope, TracerouteResults) {

  var previousIP

  var width = 960,
    height = 500;



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

  var nodes = [], links =[]

  TracerouteResults.get({ metadata_key: '8662af9e72fb46228ce307534bba5a7f' }, function(data) {
    for (i = 0; i < data[0].val.length; i++) {
      if (previousIP != data[0].val[i].ip){
        //console.log(data[0].val[i].ip)

        nodes.push({ x:   i*width/3, y: height/2 })
        if(i ==( data[0].val.length - 1) ){
         // links.push({ source: i, target:  })
        } else{
          links.push({ source: i, target: (i+1) })
        }

        
        previousIP = data[0].val[i].ip
      }
    }


  });

  var svg = d3.select("#d3fgraph").append("svg")
    .attr("width", width)
    .attr("height", height);



  var force = d3.layout.force()
    .size([width, height])
    .nodes(nodes)
    .links(links);

  force.linkDistance(width/2);

  var link = svg.selectAll('.link')
    .data(links)
    .enter().append('line')
    .attr('class', 'link');

  var node = svg.selectAll('.node')
    .data(nodes)
    .enter().append('circle')
    .attr('class', 'node');


  force.on('end', function() {

    // When this function executes, the force layout
    // calculations have concluded. The layout will
    // have set various properties in our nodes and
    // links objects that we can use to position them
    // within the SVG container.

    // First let's reposition the nodes. As the force
    // layout runs it updates the `x` and `y` properties
    // that define where the node should be centered.
    // To move the node, we set the appropriate SVG
    // attributes to their new values. We also have to
    // give the node a non-zero radius so that it's visible
    // in the container.

    node.attr('r', width/25)
      .attr('cx', function(d) { return d.x; })
      .attr('cy', function(d) { return d.y; });

    // We also need to update positions of the links.
    // For those elements, the force layout sets the
    // `source` and `target` properties, specifying
    // `x` and `y` values in each case.

    link.attr('x1', function(d) { return d.source.x; })
      .attr('y1', function(d) { return d.source.y; })
      .attr('x2', function(d) { return d.target.x; })
      .attr('y2', function(d) { return d.target.y; });

  });

  force.start();






}]);






traceroute.controller('ipAddrDecoderController', ['$scope', 'GEOIP_NEKUDO', function($scope, GEOIP_NEKUDO) {
  $scope.ip_address

  GEOIP_NEKUDO.decode({ ip_address: '192.30.252.129' }, function(data) {
    //$scope.latitude = data.latitude;
    //$scope.longitude = data.longitude;
    $scope.latitude = data.location.latitude;
    $scope.longitude = data.location.longitude;

  });

}]);



traceroute.controller('visController', ['$scope', function($scope) {
  $scope.greeting = 'Hola!';
}]);




