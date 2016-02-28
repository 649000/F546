/**
 * Created by Nazri on 24/2/16.
 */
// NOTE: App name CANNOT be in capitalized letters
// NOTE: Might want to separate tracerouteController.js out
var maps, plottingPath = new Array(), latitude, longitude, temp




//var jsonURL = 'http://hpc-perfsonar.usc.edu/esmond/perfsonar/archive/?event-type=packet-trace&format=json'
var jsonURL='../../json/hpc-perfsonar.usc.edu.json'



var traceroute = angular.module('traceroute',['tracerouteServices','ipAddrDecodeServices']);

// The name 'Traceroute' must match with the service created
traceroute.controller('traceroute_list', ['$scope', 'Traceroute', function($scope, Traceroute) {
  $scope.traceroute_list = Traceroute.list();

}]);





traceroute.controller('traceroutePlot', ['$scope', 'Traceroute_Results','GEOIP_NEKUDO', function($scope, Traceroute_Results, GEOIP_NEKUDO) {

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





traceroute.controller('route_list', ['$scope', 'Traceroute_Results', function($scope, Traceroute_Results) {
  $scope.metadata_key
  Traceroute_Results.get({ metadata_key: '00b2fb14085e49a6a5800749f94dceaa' }, function(data) {
    $scope.route_time = data[0].ts;

    $scope.route_values = data[0].val;


  });

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




/*
  The codes below are example controllers.
 */


// Avoiding Minification Problems.
function PhoneListCtrl_Minification($scope, $http) {
  //Code goes here.
}

PhoneListCtrl_Minification.$inject = ['$scope', '$http'];
traceroute.controller('PhoneListCtrl_Minification', PhoneListCtrl_Minification);

// Skeletal Structure for $http usage

traceroute.controller('PhoneListCtrl', function ($scope, $http) {
  // A control calls a function.

  $http.get(jsonURL).success(function(data) {
    $scope.phones = data;
  });

  $scope.orderProp = 'age';

});

traceroute.controller('loaddata_traceroute', ['$scope','$http',function($scope, $http){

  $http.get(jsonURL).success(function(data) {
    $scope.data_traceroute = data

  })
}]);

