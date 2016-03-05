/**
 * Created by Nazri on 28/2/16.
 */

var tracerouteServices = angular.module('TracerouteServices', ['ngResource']);

//var tracerouteListURL = 'http://hpc-perfsonar.usc.edu/esmond/perfsonar/archive/'
//var tracerouteResultURL = tracerouteListURL + ':metadata_key/packet-trace/base'

var tracerouteListURL = 'http://ps2.jp.apan.net/esmond/perfsonar/archive/'
var tracerouteResultURL = tracerouteListURL + ':metadata_key/packet-trace/base'


// REST and Custom Services
//https://docs.angularjs.org/tutorial/step_11


//Register a custom service using a factory function
//Passed in the name of the service - 'Phone'

tracerouteServices.factory('TracerouteList', ['$resource', function($resource){
  // https://docs.angularjs.org/api/ngResource/service/$resource

    return $resource(tracerouteListURL, {}, {

      list: {method:'GET', params:{'format':'json','event-type':'packet-trace'}, isArray:true}

    });

  }]);

tracerouteServices.factory('TracerouteResults', ['$resource', function($resource){

  //URL Format
  // 'http://hpc-perfsonar.usc.edu/esmond/perfsonar/archive/123AAAAAAA/packet-trace/base'
  // substitute 123AAAA with :metadata_key, similar to parameters
  return $resource(tracerouteResultURL, {}, {
    get: {method:'GET', params:{'format':'json'}, isArray:true}


  });

}]);

