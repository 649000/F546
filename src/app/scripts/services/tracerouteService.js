/**
 * Created by Nazri on 28/2/16.
 */

var tracerouteServices = angular.module('TracerouteServices', ['ngResource']);

//var tracerouteListURL = 'http://hpc-perfsonar.usc.edu/esmond/perfsonar/archive/'
//var tracerouteResultURL = tracerouteListURL + ':metadata_key/packet-trace/base'

var tracerouteResultURL = 'http://ps2.jp.apan.net/esmond/perfsonar/archive/'
var tracerouteResultIndividualURL = tracerouteResultURL + ':metadata_key/packet-trace/base'


// REST and Custom Services
//https://docs.angularjs.org/tutorial/step_11



//Register a custom service using a factory function
//Passed in the name of the service - 'Phone'



// Break down services to granular level as opposed to only calling ALL results.

// TracerouteResult, TracerouteResultIndividual, TRIndividualValue
//


tracerouteServices.factory('TracerouteResults', ['$resource', function($resource){

  // Calls the main result page.
  // Contains: Source, Destination, base-uri, metadata-key


  // https://docs.angularjs.org/api/ngResource/service/$resource
    return $resource(tracerouteResultURL, {}, {

      list: {
        method:'GET',
        params:{'format':'json','event-type':'packet-trace'},
        isArray:true
      }

    });

  }]);

tracerouteServices.factory('TracerouteResultIndividual', ['$resource', function($resource){

  // Calls the individual test containing various hops.

  //URL Format
  // 'http://hpc-perfsonar.usc.edu/esmond/perfsonar/archive/123AAAAAAA/packet-trace/base'
  // substitute 123AAAA with :metadata_key, similar to parameters

  return $resource(tracerouteResultIndividualURL, {}, {
    get: {
      method:'GET',
      params:{'format':'json'},
      isArray:true}


  });

}]);

