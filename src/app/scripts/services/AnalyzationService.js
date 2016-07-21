/**
 * Created by Nazri on 18/7/16.
 */

// Purpose: Network Analyzation
// Each new change, hard to tell, list the differences.
// Consider: https://github.com/jmdobry/angular-cache

var analyzationService = angular.module('AnalyzationService', ['ngResource']);

analyzationService.factory('Analyze_Traceroute', ['$resource', function () {

  //Conditions of an anomaly
  // 1. Change in path.
  // Idea
  // 1. List all of the history, select which one to display.
  // 2. Compare the latest with previous. if changes detected, highlight.

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
  //Conditions of an anomaly
  // 1. Values are different in a certain threshold.


  var comparison = [];

  var threshold = 100;

  return {
    compare: function (bandwidth_1, bandwidth_2) {

      var diff = bandwidth_1 - bandwidth_2;

      if (diff > Math.abs(diff)) {
        // Threshold met, anomaly detected.
        return true;

      } else {

        return false;

      }

      // Do something
    },
    add: {
      //Do Something
    }
  }

}]);
