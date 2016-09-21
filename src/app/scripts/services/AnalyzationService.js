/**
 * Created by Nazri on 18/7/16.
 */


//http://status.sgaf.org.sg/traceSG-US.html

var analyzationService = angular.module('AnalyzationServices', ['GeneralServices', 'TracerouteServices']);

analyzationService.factory('AnalyzeTracerouteRtt', ['$http', '$q', '$log', 'HostService', 'UnixTimeConverterService', 'DNSLookup', function ($http, $q, $log, HostService, UnixTimeConverterService, DNSLookup) {

  var maxDate = Number.MIN_VALUE;
  var minDate = Number.MAX_VALUE;

  return {

    getAnalysis: function (individual_traceroute_results) {
      $log.debug("AnalyzeTracerouteRtt:getAnalysis() START");

      var nodeAndRttList_CalculatedData = [];
      var nodeAndRttList_RawData = [];

      for (var k = 0; k < individual_traceroute_results.length; k++) {

        var ts = individual_traceroute_results[k]['ts'];


        if (ts > maxDate) {
          maxDate = ts;
        } else if (ts < minDate) {
          minDate = ts
        }

        for (var l = 0; l < individual_traceroute_results[k]['val'].length; l++) {


          if (individual_traceroute_results[k]['val'][l]['success'] == 1) {

            var IPAddr = individual_traceroute_results[k]['val'][l]['ip'];
            var rtt = individual_traceroute_results[k]['val'][l]['rtt'];
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

            if (IPExist == false && k == 0) {

              //IP Does not exist.


              var newNode = {
                IP: IPAddr,
                rtt: [rtt],
                date: [ts],
                dns: DNSLookup.getDomain(IPAddr).dns
              }

              nodeAndRttList_RawData.push(newNode);
            }

          }

        }
      }

      //Preprocessing of Data - Removing outliers.
      //removing outliers based on 1.5 * Interquartile range (IQR) above the 3rd quartile
      // If values are greater than the Upper Fence, pop out the value, Upper Fence = Q3 + 1.5 * IQR

      // Anomalies == true if the RRT is  more than the upper fence
      for (var i = 0; i < nodeAndRttList_RawData.length; i++) {

      }


      //Calculating Mean, Min and Std Deviation.
      for (var i = 0; i < nodeAndRttList_RawData.length; i++) {
        //LatestResult
        var rrtResult = nodeAndRttList_RawData[i]['rtt'][0];

        var rttMedian = math.median(nodeAndRttList_RawData[i]['rtt']);

        nodeAndRttList_RawData[i]['rtt'].sort(function(a,b){return a - b})





        var rttMean = math.mean(nodeAndRttList_RawData[i]['rtt']);
        var rttStdDev = math.std(nodeAndRttList_RawData[i]['rtt']);
        var rrtStatus = false;


        if (rrtResult >= (rttMean + rttStdDev)) {
          rrtStatus = true;
        }


        nodeAndRttList_CalculatedData.push(
          {
            ip: nodeAndRttList_RawData[i]['IP'],
            dns: nodeAndRttList_RawData[i]['dns'],
            // dns: "",
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

      // return nodeAndRttList_CalculatedData;
      return [nodeAndRttList_CalculatedData, minDate, maxDate];

    }

    // getMinMaxDate: function (individual_traceroute_results) {
    //
    //   //TODO: Due to the sheer amount of data, double for loops increases the processing time exponentially.
    //
    //
    //   for (var i = 0; i < individual_traceroute_results.length; i++) {
    //
    //     var ts = individual_traceroute_results[i]['ts'];
    //     console.log("TS: " + ts)
    //
    //     if (ts > maxDate) {
    //       maxDate = ts;
    //     } else if (ts < minDate) {
    //       minDate = ts
    //     }
    //
    //   }
    //
    //   return [minDate, maxDate]
    // }
  };


}]);

analyzationService.factory('AnalyzeTraceroutePath', ['$http', '$q', '$log', 'HostService', 'UnixTimeConverterService', function ($http, $q, $log, HostService, UnixTimeConverterService) {

  var maxDate = Number.MIN_VALUE;
  var minDate = Number.MAX_VALUE;

  var sourceAndDestinationList;


  return {

    getAnalysis: function (individual_traceroute_results) {
      $log.debug("AnalyzeTraceroutePath:getAnalysis() START");
      //TODO: Due to the sheer amount of data, double for loops increases the processing time exponentially.

      // Takes an array of individual traceroute results, and process it.
      // Array newest to oldest.
      // Take last X days result, find unique paths, compare it.
      // FIXME:What if the existing path also has an error?

      var anomaliesExist = false;
      var pathExist = false;
      var traceroutePaths = [];

      for (var i = 0; i < individual_traceroute_results.length; i++) {
        var ts = individual_traceroute_results[i]['ts'];
        // console.log("TS: " + ts);
        // $log.debug("TS: " + ts);
        if (ts > maxDate) {
          maxDate = ts;
        } else if (ts < minDate) {
          minDate = ts
        }

        var singleExistingPath = [];

        for (var j = 0; j < individual_traceroute_results[i]['val'].length; j++) {

          if (individual_traceroute_results[i]['val'][j]['query'] == 1) {
            // $log.debug("Adding: " + individual_traceroute_results[i]['val'][j]['ip']);
            singleExistingPath.push(individual_traceroute_results[i]['val'][j]['ip']);
          }
          // //Error in traceroute result, most likely request timed out.
          // if (individual_traceroute_results[i]['val'][j]['success'] == 0) {
          //   // return true;
          // }
        }

        traceroutePaths.push(JSON.stringify(singleExistingPath));
      }


      // $log.debug("traceroutePath.length: "+ traceroutePaths.length);
      //pastPath[0] -> Latest traceroute path to compare with.

      // myWorker.run(traceroutePaths).then(function (result) {
      //
      //   console.log("RETURNED UNIQUE PATH LENGTH: " + result[0].length);
      //   console.log("RETURNED INDEX LENGTH: " + result[1].length);
      // });

      var indexesOfError = [0];
      // var uniquePaths = [];
      //
      // for (var i = 0; i < traceroutePaths.length; i++) {
      //   // console.log("FIRST: "+traceroutePaths[i]);
      //
      //
      //   if (uniquePaths.length == 0) {
      //     // uniquePaths.push(JSON.stringify(traceroutePaths[i]));
      //     console.log("Initial Results Added");
      //     uniquePaths.push(traceroutePaths[i]);
      //   } else if (uniquePaths.length > 0) {
      //     for (var j = 0; j < uniquePaths.length; j++) {
      //
      //       console.log("Unique:"+uniquePaths[j]);
      //       console.log("!nique:"+traceroutePaths[i]);
      //       for (var k = 0; k < uniquePaths[j].length; k++) {
      //
      //         if(uniquePaths[j][k]!=traceroutePaths[i][k]){
      //           console.log("Unique Results Added");
      //           uniquePaths.push(traceroutePaths[i]);
      //           indexesOfError.push(i);
      //           break;
      //         }
      //
      //       }
      //
      //       // var trString = JSON.stringify(traceroutePaths[i]);
      //       // if (uniquePaths !== trString) {
      //       //   uniquePaths.push(trString);
      //       //   indexesOfError.push(i);
      //       // }
      //
      //
      //     }
      //   }
      //
      //
      //
      //
      // }


      // firstTRResultString = JSON.stringify(traceroutePaths[0]);
      firstTRResultString = traceroutePaths[0];

      for (var i = 1; i < traceroutePaths.length; i++) {

        observedTR = (traceroutePaths[i]);

        if (firstTRResultString !== observedTR) {
          anomaliesExist = true;
          indexesOfError.push(i);

          if ((traceroutePaths[indexesOfError[indexesOfError.length - 2]]) === observedTR) {
            indexesOfError.pop();
          }

          // break;
        }

      }


      // if (uniquePaths.length == 1) {
      //   //NO Anomalies as only one path was found.
      //   return [false, null];
      // } else if (uniquePaths.length > 1) {
      //   return [true, indexesOfError]
      // }
      // return [false, null]

      return [anomaliesExist, indexesOfError, minDate, maxDate];
    }

  };

}]);


analyzationService.factory('AnalyzeLatency', ['$log', 'UnixTimeConverterService', function ($log, UnixTimeConverterService) {

  var maxDate = Number.MIN_VALUE;
  var minDate = Number.MAX_VALUE;


  return {

    getMinMaxDate: function (individual_traceroute_results) {

      //TODO: Due to the sheer amount of data, double for loops increases the processing time exponentially.
      for (var i = 0; i < individual_traceroute_results.length; i++) {

        var ts = individual_traceroute_results[i]['ts'];
        // console.log("TS: " + ts)

        if (ts > maxDate) {
          maxDate = ts;
        } else if (ts < minDate) {
          minDate = ts
        }

      }

      return [minDate, maxDate]
    },


    getAnalysis: function () {
      $log.debug("AnalyzeLatency:getAnalysis() START");
      return true;
    }
  }

}]);
