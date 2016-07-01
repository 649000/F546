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

tracerouteServices.factory('TracerouteMainResult_URL', ['$resource', function($resource){

  // Calls the main result page.
  // url : "http://ps2.jp.apan.net/esmond/perfsonar/archive/0a468985ca8b41029a22ae4e4645f869/"
  // metadata-key : "0a468985ca8b41029a22ae4e4645f869"
  // subject-type : "point-to-point"
  // event-types
  // source : "203.30.39.127"
  // destination : "137.189.192.25"
  // measurement-agent : "203.30.39.127"
  // tool-name : "bwctl/tracepath"
  // input-source : "203.30.39.127"
  // input-destination : "ps1.itsc.cuhk.edu.hk"
  // time-interval : "600"
  // ip-transport-protocol : "icmp"
  // ip-packet-size : "40"
  // uri : "/esmond/perfsonar/archive/0a468985ca8b41029a22ae4e4645f869/"
  // metadata-count-total : 23
  // metadata-previous-page : null
  // metadata-next-page : null


  // https://docs.angularjs.org/api/ngResource/service/$resource
  return $resource(tracerouteResultURL, {}, {

    list: {
      method:'GET',
      params:{'format':'json','event-type':'packet-trace'},
      isArray:true
    }

  });

}]);
tracerouteServices.factory('TracerouteMainResults', ['$resource', function($resource){

  // Calls the main result page.
  // url : "http://ps2.jp.apan.net/esmond/perfsonar/archive/0a468985ca8b41029a22ae4e4645f869/"
  // metadata-key : "0a468985ca8b41029a22ae4e4645f869"
  // subject-type : "point-to-point"
  // event-types
  // source : "203.30.39.127"
  // destination : "137.189.192.25"
  // measurement-agent : "203.30.39.127"
  // tool-name : "bwctl/tracepath"
  // input-source : "203.30.39.127"
  // input-destination : "ps1.itsc.cuhk.edu.hk"
  // time-interval : "600"
  // ip-transport-protocol : "icmp"
  // ip-packet-size : "40"
  // uri : "/esmond/perfsonar/archive/0a468985ca8b41029a22ae4e4645f869/"
  // metadata-count-total : 23
  // metadata-previous-page : null
  // metadata-next-page : null


  // https://docs.angularjs.org/api/ngResource/service/$resource
    return $resource(tracerouteResultURL, {}, {

      list: {
        method:'GET',
        params:{'format':'json','event-type':'packet-trace'},
        isArray:true
      }

    });

  }]);


tracerouteServices.factory('TracerouteIndividualResults', ['$resource', function($resource){

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

