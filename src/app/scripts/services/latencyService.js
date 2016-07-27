/**
 * Created by Nazri on 27/7/16.
 */

var latencyServices = angular.module('LatencyServices', ['ngResource', 'GeneralServices']);


latencyServices.factory('LatencyResultsService', ['$http', '$q', '$cacheFactory', '$log','HostService', function ($http, $q, $log, $cacheFactory, HostService) {


  // cache http://stackoverflow.com/questions/21660647/angular-js-http-cache-time
  var host = HostService.getHost();

  return {

    getOneWayDelay_MainResult: function () {
      return $http({
        method: 'GET',
        url: host,
        params: {
          'format': 'json',
          'event-type': 'histogram-owdelay'
          // 'limit': 10,
          // 'time-end': (Math.floor(Date.now() / 1000)),
          // 'time-range': timeRange
        },
        cache: true
      })
    },

    getOneWayDelay_IndividualResult: function (metadataURL, timeRange) {

      return $http({
        method: 'GET',
        url: metadataURL + "histogram-owdelay/base",
        params: {
          'format': 'json',
          // 'limit': '2',
          // 'time-end': (Math.floor(Date.now() / 1000)),
          'time-range': timeRange
          //48 Hours = 172800
          // 24 hours = 86400
          //604800 (7days).
        },
        cache: true
      });
    },

    clearCache: function () {
      $cacheFactory.get('$http').removeAll();
      $log.debug("LatencyResultsService:clearCache() Cache Cleared");
    }



  };


}]);
