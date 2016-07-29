/**
 * Created by Nazri on 25/2/16.
 */

var ipAddrDecodeServices = angular.module('IPAddrDecodeServices', ['ngResource']);


/**
 * http://fdietz.github.io/recipes-with-angular-js//consuming-external-services/consuming-restful-apis.html
 * https://docs.angularjs.org/api/ngResource/service/$resource
 *
 */



// http://ip-api.com/docs/api:json
// 150 requests per minute

var baseAPIURL_IPAPI = 'http://ip-api.com/json/'
var executionURL_IPAPI = baseAPIURL_IPAPI + ':ip_address'


//9bf7a0d2242a9aefe51a62c64f512589791b09a1d47209f4e11fc6fd83ff4d81
//http://www.ipinfodb.com/ip_location_api.php
var baseAPIURL_IP_INFO_DB = 'http://api.ipinfodb.com/v3/ip-city/?key=9bf7a0d2242a9aefe51a62c64f512589791b09a1d47209f4e11fc6fd83ff4d81&format=json&ip='
var executionURL_IP_INFO_DB = baseAPIURL_IP_INFO_DB + ':ip_address'


var baseAPIURL_GEOIP_NEKUDO = 'http://geoip.nekudo.com/api/'
var executionURL_GEOIP_NEKUDO = baseAPIURL_GEOIP_NEKUDO + ':ip_address'


/**
 * JSON RECEIVED AS
 * Latitude: latitude
 * Longitude: longitude
 */
ipAddrDecodeServices.factory('FreeGeoIP', ['$resource', function ($resource) {

  return $resource(executionURL_FreeGeoIP, {}, {
    decode: {method: 'GET', params: {}, isArray: false}


  });

}]);

/**
 * JSON RECEIVED AS
 * Latitude: lat
 * Longitude: lon
 */
ipAddrDecodeServices.factory('IP_API', ['$resource', function ($resource) {

  return $resource(executionURL_IPAPI, {}, {
    decode: {method: 'GET', params: {}, isArray: false}
  });

}]);

/**
 * JSON RECEIVED AS
 * Latitude: latitude
 * Longitude: longitude
 */
ipAddrDecodeServices.factory('IP_INFO_DB', ['$resource', function ($resource) {

  return $resource(executionURL_IP_INFO_DB, {}, {
    decode: {method: 'GET', params: {}, isArray: false}
  });

}]);

/**
 * .location.latitude
 * .location.longitude
 */
ipAddrDecodeServices.factory('GEOIP_NEKUDO', ['$resource', function ($resource) {

  // Not any difference from promises
  return $resource(executionURL_GEOIP_NEKUDO, {}, {
    decode: {method: 'GET', params: {}, isArray: false}
  });

}]);


ipAddrDecodeServices.factory('FreeGeoIPService', ['$http', '$q', '$cacheFactory', '$log', function ($http, $q, $log, $cacheFactory) {

// https://freegeoip.net
// 10,000 queries per hour
  /**
   * JSON RECEIVED AS
   * Latitude: latitude
   * Longitude: longitude
   */


  var host = "http://freegeoip.net/json/";

  return {

    getCountry: function (IPAddress) {

      var country = $http({
        method: 'GET',
        url: host + IPAddress,
        params: {
          //SET PARAMS HERE
          // 'format': 'json',
          // 'event-type': 'packet-trace'
          // 'limit': 10,
          // 'time-end': (Math.floor(Date.now() / 1000)),
          // 'time-range': timeRange
        },
        cache: true
      }).then(function (response) {

        //response.data should be country
        return {
          city: response.data.city,
          country: response.data.country_name
        }


      });

      return country;
    },

    getCoordinates: function (IPAddress) {
      var coordinates = [];

      coordinates = $http({
        method: 'GET',
        url: host + IPAddress,
        params: {

          // 'format': 'json',
          // 'event-type': 'packet-trace'
          // 'limit': 10,
          // 'time-end': (Math.floor(Date.now() / 1000)),
          // 'time-range': timeRange
        },
        cache: true
      }).then(function (response) {

        return [response.data, response.data];
      });
      return coordinates;
    }
  };

}]);

ipAddrDecodeServices.factory('GeoIPNekudoService', ['$http', '$cacheFactory', '$log', function ($http, $log, $cacheFactory) {

  var host = "http://geoip.nekudo.com/api/";

  return {

    getCountry: function (IPAddress) {

      var country = $http({
        method: 'GET',
        url: host + IPAddress,
        params: {
          //SET PARAMS HERE
          // 'format': 'json',
          // 'event-type': 'packet-trace'
          // 'limit': 10,
          // 'time-end': (Math.floor(Date.now() / 1000)),
          // 'time-range': timeRange
        },
        cache: true
      }).then(function (response) {

        //response.data should be country
        return {
          ip: IPAddress,
          city: response.data.city,
          country: response.data.country.name,
          countrycode:response.data.country.code
        }


      });

      return country;
    },

    getCoordinates: function (IPAddress) {
      var coordinates = [];

      coordinates = $http({
        method: 'GET',
        url: host + IPAddress,
        params: {

          // 'format': 'json',
          // 'event-type': 'packet-trace'
          // 'limit': 10,
          // 'time-end': (Math.floor(Date.now() / 1000)),
          // 'time-range': timeRange
        },
        cache: true
      }).then(function (response) {

        return [response.data, response.data];
      });
      return coordinates;
    }
  };

}]);
