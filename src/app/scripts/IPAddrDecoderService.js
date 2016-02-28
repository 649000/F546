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


//9bf7a0d2242a9aefe51a62c64f512589791b09a1d47209f4e11fc6fd83ff4d81
//http://www.ipinfodb.com/ip_location_api.php
var baseAPIURL_IP_INFO_DB = 'http://api.ipinfodb.com/v3/ip-city/?key=9bf7a0d2242a9aefe51a62c64f512589791b09a1d47209f4e11fc6fd83ff4d81&format=json&ip='
var executionURL_IP_INFO_DB = baseAPIURL_IP_INFO_DB +':ip_address'


var baseAPIURL_GEOIP_NEKUDO='http://geoip.nekudo.com/api/'
var executionURL_GEOIP_NEKUDO = baseAPIURL_GEOIP_NEKUDO+':ip_address'


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

/**
 * JSON RECEIVED AS
 * Latitude: latitude
 * Longitude: longitude
 */
ipAddrDecodeServices.factory('IP_INFO_DB', ['$resource', function($resource){

  return $resource(executionURL_IP_INFO_DB, {}, {
    decode: {method:'GET', params:{}, isArray:false}
  });

}]);

/**
 * .location.latitude
 * .location.longitude
 */
ipAddrDecodeServices.factory('GEOIP_NEKUDO', ['$resource', function($resource){

  return $resource(executionURL_GEOIP_NEKUDO, {}, {
    decode: {method:'GET', params:{}, isArray:false}
  });

}]);

