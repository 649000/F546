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

    //
    // getRtt: function () {
    //
    //   $log.debug("AnalyzationServices:AnalyzeTraceroute:getRtt()");
    //   var host = HostService.getHost();
    //
    //   return $http({
    //     method: 'GET',
    //     url: host,
    //     params: {
    //       'format': 'json',
    //       'event-type': 'packet-trace'
    //       // 'limit': 10,
    //       // 'time-end': (Math.floor(Date.now() / 1000)),
    //       // 'time-range': timeRange
    //     },
    //     cache: true
    //   })
    //
    //
    // },

    analyzeRtt: function (individual_traceroute_results) {

      // Takes an array of individual traceroute results, and process it.
      $log.debug("AnalyzeTraceroute:analyzeRtt() START");


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
        var rttStdDev = math.std(nodeAndRttList_RawData[i]['rtt']);
        var rrtStatus = false;


        if (rrtResult >= (rttMean+rttStdDev) || rrtResult <= (rttMean-rttStdDev)) {
          rrtStatus = true;
        }


        nodeAndRttList_CalculatedData.push(
          {
            ip: nodeAndRttList_RawData[i]['IP'],
            rtt: rrtResult,
            rttAvg: math.round(rttMean, 4),
            rttMin: math.number(math.min(nodeAndRttList_RawData[i]['rtt'])),
            rttStd: math.round(rttStdDev, 4),
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

    // getPath: function (traceroute_metadata) {
    //   var host = HostService.getHost();
    //
    //   // This returns ALL apths of the time range for that traceroute metadata
    //   // JavaScript Promise
    //   return $http({
    //     method: 'GET',
    //     url: host + traceroute_metadata + "/packet-trace/base",
    //     params: {
    //       'format': 'json',
    //       'event-type': 'packet-trace',
    //       // 'limit': 10,
    //       // 'time-end': (Math.floor(Date.now() / 1000)),
    //       'time-range': 604800
    //       // 24 hours = 86400
    //       // 7 days = 604800
    //     },
    //     cache: true
    //   })
    // },

    analyzePath: function (individual_traceroute_results) {

      // Takes an array of individual traceroute results, and process it.
      // Array newest to oldest.
      // Take last X days result, find unique paths, compare it.
      // FIXME:What if the existing path also has an error?

      $log.debug("AnalyzeTraceroute:analyzePath() START");


      var anomaliesExist = false;
      var pathExist = false;
      var traceroutePaths = [];

      for (var i = 0; i < individual_traceroute_results.length; i++) {

        var ts = individual_traceroute_results[i]['ts'];
        // $log.debug(ts)

        var singleExistingPath = [];

        for (var j = 0; j < individual_traceroute_results[i]['val'].length; j++) {

          //FIXME: Do we ignore query 1,2, 3?
          //FIXME: What about path with traceroute errors?


          if (individual_traceroute_results[i]['val'][j]['query'] == 1) {
            // $log.debug("Adding: " + individual_traceroute_results[i]['val'][j]['ip']);
            singleExistingPath.push(individual_traceroute_results[i]['val'][j]['ip']);
          }

          //Error in traceroute result, most likely request timed out.
          if (individual_traceroute_results[i]['val'][j]['success'] == 0) {

            // return true;
          }

        }
        traceroutePaths.push(singleExistingPath);
      }


      // $log.debug("traceroutePath.length: "+ traceroutePaths.length);
      //pastPath[0] -> Latest traceroute path to compare with.


      //Checking if the latest path, index 0 exist in anything.
      // for (var i = 1; i < traceroutePaths.length; i++) {
      //
      //   // $log.debug(JSON.stringify(traceroutePaths[0]) + "< Comparing >" + JSON.stringify(traceroutePaths[i]));
      //
      //   if (JSON.stringify(traceroutePaths[0]) === JSON.stringify(traceroutePaths[i])) {
      //     pathExist = true;
      //   }
      //
      // }
      //
      // if(pathExist==false){
      //   anomaliesExist = true;
      // }


      //FIXME: For Demonstration purposes, the above is commented out, and the below is added in.

      for (var i = 1; i < traceroutePaths.length; i++) {

        if (JSON.stringify(traceroutePaths[0]) !== JSON.stringify(traceroutePaths[i])) {
          pathExist = true;
        }

      }

      if(pathExist==false){
        anomaliesExist = true;
      }



      //TODO: Figure out what else to return other than TRUE/FALSE
       // $log.debug("analyzePath() Return Msg: " + pathExist);
      // return anomaliesExist;
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
