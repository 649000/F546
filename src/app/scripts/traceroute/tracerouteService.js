/**
 * Created by Nazri on 28/2/16.
 */

var tracerouteServices = angular.module('tracerouteServices', ['ngResource']);

var tracerouteURL = 'http://hpc-perfsonar.usc.edu/esmond/perfsonar/archive/'
var traceroute_results = tracerouteURL + ':metadata_key/packet-trace/base'

//var jsonURL='../../json/hpc-perfsonar.usc.edu.json'

// REST and Custom Services
//https://docs.angularjs.org/tutorial/step_11


//Register a custom service using a factory function
//Passed in the name of the service - 'Phone'

tracerouteServices.factory('Traceroute', ['$resource', function($resource){
  // https://docs.angularjs.org/api/ngResource/service/$resource

    return $resource(tracerouteURL, {}, {

      list: {method:'GET', params:{'format':'json','event-type':'packet-trace'}, isArray:true}

    });

  }]);

tracerouteServices.factory('Traceroute_Results', ['$resource', function($resource){

  //URL Format
  // 'http://hpc-perfsonar.usc.edu/esmond/perfsonar/archive/123AAAAAAA/packet-trace/base'
  // substitute 123AAAA with :metadata_key, similar to parameters
  return $resource(traceroute_results, {}, {
    get: {method:'GET', params:{'format':'json'}, isArray:true}


  });

}]);

