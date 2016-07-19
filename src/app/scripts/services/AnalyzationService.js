/**
 * Created by Nazri on 18/7/16.
 */

var analyzationService = angular.module('AnalyzationService', ['ngResource']);

analyzationService.factory('Analyze_Traceroute', ['$resource', function () {

  var comparison = [];

  return {
    compare: {

      // Do something
    },
    add: {
      //Do Something
    }
  }


}]);

analyzationService.factory('Analyze_Bandwidth', ['$resource', function () {


}]);
