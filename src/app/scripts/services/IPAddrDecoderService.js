/**
 * Created by Nazri on 25/2/16.
 */

var ipAddrDecodeServices = angular.module('IPAddrDecodeServices', []);


ipAddrDecodeServices.factory('FreeGeoIPService', ['$http', '$log', function ($http, $log) {

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
      })

        .then(function (response) {

          //response.data should be country
          return {
            ip: IPAddress,
            city: response.data.city,
            country: response.data.country_name,
            countrycode: response.data.country_code
          }

        });

      return country;
    },

  };

}]);


ipAddrDecodeServices.factory('GeoIPNekudoService', ['$http', '$log', 'CacheFactory', function ($http, $log, CacheFactory) {

  var host = "http://geoip.nekudo.com/api/";

  var IPAddr_LocationCache;
//IPAddr_Location
  if (!CacheFactory.get("IPAddr_Location")) {
    IPAddr_LocationCache = CacheFactory('IPAddr_Location', {
      maxAge: 10080 * 60 * 1000, // Items added to this cache expire after 1 week,
      //10080 minutes = 1 week
      // 20160  = 2 weeks
      deleteOnExpire: 'aggressive', // Items will be deleted from this cache right when they expire.
      storageMode: 'sessionStorage' // This cache will use `localStorage`.
    });
  }
  3

  return {

    getCountry: function (IPAddress) {


      if (CacheFactory.get("IPAddr_Location").get(IPAddress)) {

        $log.debug("Cache Found for " + IPAddress)
        return CacheFactory.get("IPAddr_Location").get(IPAddress);

      } else {
        var country = $http({
          method: 'GET',
          url: host + IPAddress,
          params: {
            // 'format': 'json'
          },
          cache: true,
          ignoreLoadingBar: true
        }).then(function (response) {

          // console.log(response)

          if (response.data.hasOwnProperty("type") && response.data.hasOwnProperty("msg")) {

            var geocodedIP = {
              ip: IPAddress,
              city: "Unknown",
              // country: "",//response.data.country.name,
              countrycode: "Unknown"//response.data.country.code
            }
            // IPAddr_LocationCache.put(IPAddress, geocodedIP);

          } else {
            var cityName = response.data.city

            if (cityName == false) {
              cityName = "Unknown"
            }
            var geocodedIP = {
              ip: IPAddress,
              city: cityName,
              // country: response.data.country.name,
              countrycode: response.data.country.code
            }
            IPAddr_LocationCache.put(IPAddress, geocodedIP);

          }


          return geocodedIP;

        });

        return country;

      }


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


ipAddrDecodeServices.factory('DNSLookup', ['$http', '$log', 'CacheFactory','HostService', function ($http, $log, CacheFactory,HostService) {

  //TODO: Remember to update IP Address if needed.
  var host = "http://"+HostService.getServerIP()+"/reversednslookup";
  var DNSCache;

  if (!CacheFactory.get("ReverseIPLookup")) {

    DNSCache = CacheFactory('ReverseIPLookup', {
      maxAge: 7200 * 60 * 1000, // Items added to this cache expire after 5 days,
      //1440 = 24 hours
      deleteOnExpire: 'aggressive', // Items will be deleted from this cache right when they expire.
      storageMode: 'localStorage' // This cache will use `localStorage`.
    });
  }


  return {

    getDomain: function (IPAddress) {

      if (CacheFactory.get("ReverseIPLookup").get(IPAddress)) {

        return CacheFactory.get("ReverseIPLookup").get(IPAddress);

      } else {

        var dnsLookup = $http({
          method: 'GET',
          url: host,
          params: {
            'ipaddress': IPAddress
          },
          cache: true,
          ignoreLoadingBar: true

        }).then(function (response) {

          var tempResult = {
            ip: IPAddress,
            dns: response.data.dns
          }
          // console.log(response)
          if (response.data.dns != "Unknown") {
            DNSCache.put(IPAddress, tempResult);
          }

          return tempResult;


        });
        return dnsLookup;
      }

    }

    // getDomain_Promise: function (IPAddress) {
    //
    //   if (CacheFactory.get("ReverseIPLookup").get(IPAddress)) {
    //
    //     return CacheFactory.get("ReverseIPLookup").get(IPAddress);
    //
    //   } else
    //   {
    //
    //     var dnsLookup = $http({
    //       method: 'GET',
    //       url: host,
    //       params: {
    //         'ipaddress': IPAddress
    //       },
    //       cache: true,
    //       ignoreLoadingBar: false
    //
    //     })
    //
    //     //   .then(function (response) {
    //     //
    //     //   var tempResult = {
    //     //     ip: IPAddress,
    //     //     dns: response.data.dns
    //     //   }
    //     //   // console.log(response)
    //     //   if (response.data.dns != "Unknown") {
    //     //     DNSCache.put(IPAddress, tempResult);
    //     //   }
    //     //
    //     //   return tempResult;
    //     //
    //     //
    //     // });
    //     return dnsLookup;
    //   }
    //
    // }


  };

}]);


/*
 Following Code Underneath are without angular-cache library. Solely for testing purposes.
 */

// ipAddrDecodeServices.factory('GeoIPNekudoService', ['$http', '$log', function ($http, $log) {
//
//   var host = "http://geoip.nekudo.com/api/";
//
//   var IPAddr_LocationCache;
// //IPAddr_Location
//
//
//
//   return {
//
//     getCountry: function (IPAddress) {
//
//       {
//         var country = $http({
//           method: 'GET',
//           url: host + IPAddress,
//           params: {
//             // 'format': 'json'
//           },
//           cache: true,
//           ignoreLoadingBar: true
//         }).then(function (response) {
//
//           // console.log(response)
//
//           if (response.data.hasOwnProperty("type") && response.data.hasOwnProperty("msg")) {
//
//             var geocodedIP = {
//               ip: IPAddress,
//               city: "Unknown",
//               // country: "",//response.data.country.name,
//               countrycode: "Unknown"//response.data.country.code
//             }
//             // IPAddr_LocationCache.put(IPAddress, geocodedIP);
//
//           } else {
//             var cityName = response.data.city
//
//             if (cityName == false) {
//               cityName = "Unknown"
//             }
//             var geocodedIP = {
//               ip: IPAddress,
//               city: cityName,
//               // country: response.data.country.name,
//               countrycode: response.data.country.code
//             }
//
//           }
//
//
//           return geocodedIP;
//
//         });
//
//         return country;
//
//       }
//
//
//     },
//
//     getCoordinates: function (IPAddress) {
//       var coordinates = [];
//
//       coordinates = $http({
//         method: 'GET',
//         url: host + IPAddress,
//         params: {
//
//           // 'format': 'json',
//           // 'event-type': 'packet-trace'
//           // 'limit': 10,
//           // 'time-end': (Math.floor(Date.now() / 1000)),
//           // 'time-range': timeRange
//         },
//         cache: true
//       }).then(function (response) {
//
//         return [response.data, response.data];
//       });
//       return coordinates;
//     }
//   };
//
// }]);
//
//
// ipAddrDecodeServices.factory('DNSLookup', ['$http', '$log', function ($http, $log) {
//
//   //FIXME: THIS IP ADDRESS HAS TO BE CHANGE TO THE SERVER IP THAT IS BEING DEPLOYED TO
//   var host = "http://203.30.39.133/reversednslookup";
//   var DNSCache;
//
//
//
//
//   return {
//
//     getDomain: function (IPAddress) {
//
// {
//
//         var dnsLookup = $http({
//           method: 'GET',
//           url: host,
//           params: {
//             'ipaddress': IPAddress
//           },
//           cache: true,
//           ignoreLoadingBar: true
//
//         }).then(function (response) {
//
//           var tempResult = {
//             ip: IPAddress,
//             dns: response.data.dns
//           }
//           // console.log(response)
//           if (response.data.dns != "Unknown") {
//
//           }
//
//           return tempResult;
//
//
//         });
//         return dnsLookup;
//       }
//
//     }
//
//     // getDomain_Promise: function (IPAddress) {
//     //
//     //   if (CacheFactory.get("ReverseIPLookup").get(IPAddress)) {
//     //
//     //     return CacheFactory.get("ReverseIPLookup").get(IPAddress);
//     //
//     //   } else
//     //   {
//     //
//     //     var dnsLookup = $http({
//     //       method: 'GET',
//     //       url: host,
//     //       params: {
//     //         'ipaddress': IPAddress
//     //       },
//     //       cache: true,
//     //       ignoreLoadingBar: false
//     //
//     //     })
//     //
//     //     //   .then(function (response) {
//     //     //
//     //     //   var tempResult = {
//     //     //     ip: IPAddress,
//     //     //     dns: response.data.dns
//     //     //   }
//     //     //   // console.log(response)
//     //     //   if (response.data.dns != "Unknown") {
//     //     //     DNSCache.put(IPAddress, tempResult);
//     //     //   }
//     //     //
//     //     //   return tempResult;
//     //     //
//     //     //
//     //     // });
//     //     return dnsLookup;
//     //   }
//     //
//     // }
//
//
//   };
//
// }]);
