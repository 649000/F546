/**
 * Created by Nazri on 25/2/16.
 */

var ipAddrDecodeServices = angular.module('ipAddrDecodeServices', ['ngResource']);


/**
 * http://fdietz.github.io/recipes-with-angular-js//consuming-external-services/consuming-restful-apis.html
 * https://docs.angularjs.org/api/ngResource/service/$resource
 *
 */


// https://freegeoip.net
// 10,000 queries per hour
var baseAPIURL_FreeGeoIP = 'http://freegeoip.net/json/'
var executionURL_FreeGeoIP = baseAPIURL_FreeGeoIP+':ip_address'

// http://ip-api.com/docs/api:json
// 150 requests per minute

var baseAPIURL_IPAPI = 'http://ip-api.com/json/'
var executionURL_IPAPI = baseAPIURL_IPAPI+':ip_address'

/**
 * JSON RECEIVED AS
 * Latitude: latitude
 * Longitude: longitude
 */
ipAddrDecodeServices.factory('FreeGeoIP', ['$resource', function($resource){

  return $resource(executionURL_FreeGeoIP, {}, {
    decode: {method:'GET', params:{}, isArray:false}


  });

}]);

/**
 * JSON RECEIVED AS
 * Latitude: lat
 * Longitude: lon
 */
ipAddrDecodeServices.factory('IP_API', ['$resource', function($resource){

  return $resource(executionURL_IPAPI, {}, {
    decode: {method:'GET', params:{}, isArray:false}


  });

}]);

