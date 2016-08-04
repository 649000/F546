/**
 * Created by Nazri on 18/7/16.
 */

// Purpose: Network Analyzation
// Each new change, hard to tell, list the differences.
// Consider: https://github.com/jmdobry/angular-cache

//http://status.sgaf.org.sg/traceSG-US.html

var analyzationService = angular.module('AnalyzationServices', ['ngResource', 'GeneralServices', 'TracerouteServices']);

analyzationService.factory('AnalyzeTraceroute', ['$http', '$q', '$log', 'HostService', 'UnixTimeConverterService', function ($http, $q, $log, HostService, UnixTimeConverterService) {

  $log.debug("AnalyzationServices:AnalyzeTraceroute");

  var host = HostService.getHost();
  var sourceAndDestinationList;

  return {

    getAnalyzation: function () {
      // For each TR result, calculate last 7 days of average min RTT, mean RTT, std deviation RTT

      sourceAndDestinationList = [];

      var analyzedTRList = TracerouteResultsService.getMainResult().then(function (response) {

        $log.debug("AnalyzationServices:AnalyzeTraceroute:getAnalyzation() -> Main Response: " + response.data.length)

        var promises = [];

        for (var i = 0; i < response.data.length; i++) {

          sourceAndDestinationList.push(
            {
              source: response.data[i]['source'],
              destination: response.data[i]['destination']
            }
          );


          for (var j = 0; j < response.data[i]['event-types'].length; j++) {
            if (response.data[i]['event-types'][j]['event-type'] == 'packet-trace') {

              var promise = TracerouteResultsService.getIndividualResult(response.data[i]['url'], 604800);
              promises.push(promise);

            }
          }

          // analyzeResults(promises, source, destination);

        }


        return $q.all(promises);

      }).then(function (response) {

        $log.debug("AnalyzationServices:AnalyzeTraceroute:getAnalyzation() -> Start of second .then response");

        var nodeAndRttList_CalculatedData = [];
        var nodeAndRttList_RawData = [];

        var startDate;
        var endDate;


        for (var i = 0; i < response.length; i++) {

          $log.debug("Source: " + sourceAndDestinationList[i]['source']);
          $log.debug("Destination: " + sourceAndDestinationList[i]['destination']);

          // Checking for 'active' servers
          if (response[i].data.length > 1) {

            for (var k = 0; k < response[i].data.length; k++) {

              var ts = response[i].data[k]['ts'];

              for (var l = 0; l < response[i].data[k]['val'].length; l++) {

                var IPAddr = response[i].data[k]['val'][l]['ip'];
                var rtt = response[i].data[k]['val'][l]['rtt'];
                var IPExist = false;

                // Check if the IP Address already exist in the list.
                for (var j = 0; j < nodeAndRttList_RawData.length; j++) {

                  //IP Address Exist. Append new rtt value.
                  if (nodeAndRttList_RawData[j]['IP'] == IPAddr) {
                    IPExist = true;
                    nodeAndRttList_RawData[j]['rtt'].push(rtt);
                  }
                }

                if (IPExist == false) {

                  var newNode = {
                    //source: xx,
                    //destination: xx
                    IP: IPAddr,
                    rtt: [rtt],
                    date: [ts]
                  }

                  nodeAndRttList_RawData.push(newNode);
                }
              }
            }


          }
        }

        //Calculating Mean, Min and Std Deviation.
        for (var i = 0; i < nodeAndRttList_RawData.length; i++) {

          nodeAndRttList_CalculatedData.push(
            {
              source: 0,
              destination: 0,
              nodes: {
                ip: nodeAndRttList_RawData[i]['IP'],
                rttAvg: math.mean(nodeAndRttList_RawData[i]['rtt']),
                rttMin: math.number(math.min(nodeAndRttList_RawData[i]['rtt'])),
                rttStd: math.std(nodeAndRttList_RawData[i]['rtt']),
                startDate: math.number(math.min(nodeAndRttList_RawData[i]['date'])),
                endDate: math.number(math.max(nodeAndRttList_RawData[i]['date']))
              }
            }
          );

        }

        return nodeAndRttList_CalculatedData;

      }).catch(function (error) {
        console.log("AnalyzationServices:AnalyzeTraceroute:getAnalyzation() -> Error: " + error);
      });

      return analyzedTRList;


    },
//Option 1. return $q.all(promises) and do then on the controller, no source/destination.
    // If option 1 doesn't work, try this:
    getSourceAndDestination: function () {
      // returns promise of main TR result. chain it with getAnalyzation's promise.

    },

    getRtt: function () {

      $log.debug("AnalyzationServices:AnalyzeTraceroute:getRtt()");
      var host = HostService.getHost();

      return $http({
        method: 'GET',
        url: host,
        params: {
          'format': 'json',
          'event-type': 'packet-trace'
          // 'limit': 10,
          // 'time-end': (Math.floor(Date.now() / 1000)),
          // 'time-range': timeRange
        },
        cache: true
      })


    },

    analyzeRtt: function (individual_traceroute_results) {

      $log.debug("AnalyzationServices:AnalyzeTraceroute:analyzeRtt()");

      var nodeAndRttList_CalculatedData = [];
      var nodeAndRttList_RawData = [];

      var reversedResponse = individual_traceroute_results.reverse();


      for (var k = 0; k < reversedResponse.length; k++) {

        var ts = reversedResponse[k]['ts'];

        for (var l = 0; l < reversedResponse[k]['val'].length; l++) {


          //What about Query 1,2,3?
          if (reversedResponse[k]['val'][l]['success'] == 1) {

            var IPAddr = reversedResponse[k]['val'][l]['ip'];
            var rtt = reversedResponse[k]['val'][l]['rtt'];
            var IPExist = false;

            // Check if the IP Address already exist in the list.
            for (var j = 0; j < nodeAndRttList_RawData.length; j++) {

              //IP Address Exist. Append new rtt value.
              if (nodeAndRttList_RawData[j]['IP'] == IPAddr) {
                IPExist = true;
                nodeAndRttList_RawData[j]['rtt'].push(rtt);
                nodeAndRttList_RawData[j]['date'].push(ts)
              }
            }

            if (IPExist == false) {

              var newNode = {
                IP: IPAddr,
                rtt: [rtt],
                date: [ts]
              }

              nodeAndRttList_RawData.push(newNode);
            }

          }

        }
      }


      //Calculating Mean, Min and Std Deviation.
      for (var i = 0; i < nodeAndRttList_RawData.length; i++) {

        var rrtResult = nodeAndRttList_RawData[i]['rtt'][0];
        var rttMean = math.mean(nodeAndRttList_RawData[i]['rtt']);
        var rrtStatus = false;


        if (rrtResult < rttMean) {
          rrtStatus = true;
        }


        nodeAndRttList_CalculatedData.push(
          {
            ip: nodeAndRttList_RawData[i]['IP'],
            rtt: nodeAndRttList_RawData[i]['rtt'][0],
            rttAvg: math.mean(nodeAndRttList_RawData[i]['rtt']),
            rttMin: math.number(math.min(nodeAndRttList_RawData[i]['rtt'])),
            rttStd: math.std(nodeAndRttList_RawData[i]['rtt']),
            // startDate: math.number(math.min(nodeAndRttList_RawData[i]['date'])),
            // endDate: math.number(math.max(nodeAndRttList_RawData[i]['date']))
            //DATE MIGHT BE POSSIBLY WRONG
            startDate: UnixTimeConverterService.getDate(math.number(math.min(nodeAndRttList_RawData[i]['date']))),
            endDate: UnixTimeConverterService.getDate(math.number(math.max(nodeAndRttList_RawData[i]['date']))),
            startTime: UnixTimeConverterService.getTime(math.number(math.min(nodeAndRttList_RawData[i]['date']))),
            endTime: UnixTimeConverterService.getTime(math.number(math.max(nodeAndRttList_RawData[i]['date']))),
            status: rrtStatus

          }
        );

      }

      return nodeAndRttList_CalculatedData;

    },

    getPath: function (traceroute_metadata) {
      var host = HostService.getHost();

      // This returns ALL apths of the time range for that traceroute metadata
      // JavaScript Promise
      return $http({
        method: 'GET',
        url: host + traceroute_metadata + "/packet-trace/base",
        params: {
          'format': 'json',
          'event-type': 'packet-trace',
          // 'limit': 10,
          // 'time-end': (Math.floor(Date.now() / 1000)),
          'time-range': 604800
          // 24 hours = 86400
          // 7 days = 604800
        },
        cache: true
      })
    },

    analyzePath: function (traceroute_results, latest_result) {

      // Array newest to oldest.

      // Take last 7 days result, find unique paths, compare it.

      // What if the existing path also has an error?


      var results = {
        ts: 1,
        path: [1, 2, 3, 4]
      }
      var pathExist = false;

      //Need to return the path that it found?
      // var existedPath = [];

      for (var i = 0; i < traceroute_results.length; i++) {

        if (JSON.stringify(traceroute_results[i].path) === JSON.stringify(latest_result)) {
          pathExist = true;
        }

      }

      return pathExist;
    }
  };

  function analyzeResults(promises, source, destination) {
    // if 0 or only 1 result, skip.
    //else do the calculation here.

    $q.all(promises).then(function (response) {

      // Either return or push the array here.
      var results = {
        source: source,
        destination: destination,
        threshold: []
      };

      var toCalculate = [];


      for (var i = 0; i < response.length; i++) {
        // Checking for 'active' servers
        if (response[i].data.length > 1) {

          for (var k = 0; k < response[i].data.length; k++) {

            for (var l = 0; l < response[i].data[k]['val'].length; l++) {

              var IPAddr = response[i].data[k]['val'][l]['ip']
              var rtt = response[i].data[k]['val'][l]['rtt']
              var IPExist = false;

              for (var j = 0; j < toCalculate.length; j++) {
                if (toCalculate[j]['IP'] == IPAddr) {
                  IPExist = true;
                  toCalculate[j]['rtt'].push(rtt);
                }
              }

              if (IPExist == false) {

                var tempResult = {
                  IP: IPAddr,
                  rtt: [rtt]
                }

                toCalculate.push(tempResult);
              }
            }
          }


        }
      }

      //Calculating Mean, Min and Std Deviation.
      for (var i = 0; i < toCalculate.length; i++) {
        results['threshold']['ip'] = toCalculate[i]['IP']
        results['threshold']['rttAvg'] = math.mean(toCalculate[i]['rtt']);
        results['threshold']['rttMin'] = math.min(toCalculate[i]['rtt']);
        results['threshold']['rttStd'] = math.std(toCalculate[i]['rtt']);

        analyzedTRList.push(results);
      }


    });

  }


}]);

analyzationService.factory('Analyze_Bandwidth', [function () {
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

analyzationService.factory('Analyze_Latency', [function () {
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
