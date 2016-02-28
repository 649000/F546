/**
 * Created by Nazri on 24/2/16.
 */
// NOTE: App name CANNOT be in capitalized letters
// NOTE: Might want to separate tracerouteController.js out

//var jsonURL = 'http://hpc-perfsonar.usc.edu/esmond/perfsonar/archive/?event-type=packet-trace&format=json'
var jsonURL='../../json/hpc-perfsonar.usc.edu.json'



var traceroute = angular.module('traceroute',['tracerouteServices','ipAddrDecodeServices']);

// The name 'Traceroute' must match with the service created
traceroute.controller('traceroute_list', ['$scope', 'Traceroute', function($scope, Traceroute) {
  $scope.traceroute_list = Traceroute.list();

}]);

traceroute.controller('route_list', ['$scope', 'Traceroute_Results', function($scope, Traceroute_Results) {
  $scope.metadata_key
  Traceroute_Results.get({ metadata_key: '00b2fb14085e49a6a5800749f94dceaa' }, function(data) {
    $scope.route_time = data[0].ts;
    $scope.route_values = data[0].val;
  });

}]);

traceroute.controller('ipAddrDecoderController', ['$scope', 'IP_API', function($scope, IP_API) {

  $scope.ip_address

  IP_API.decode({ ip_address: '192.30.252.129' }, function(data) {
    $scope.latitude = data.lat;
    $scope.longitude = data.lon;
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

