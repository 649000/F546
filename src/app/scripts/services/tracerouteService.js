/**
 * Created by Nazri on 28/2/16.
 */

var tracerouteServices = angular.module('TracerouteServices', ['ngResource']);

//var tracerouteListURL = 'http://hpc-perfsonar.usc.edu/esmond/perfsonar/archive/'
//var tracerouteResultURL = tracerouteListURL + ':metadata_key/packet-trace/base'

var tracerouteResultURL = 'http://ps2.jp.apan.net/esmond/perfsonar/archive/'
var tracerouteResultIndividualURL = tracerouteResultURL + ':metadata_key/packet-trace/base'


// REST and Custom Services
//https://docs.angularjs.org/tutorial/step_11



//Register a custom service using a factory function
//Passed in the name of the service - 'Phone'



// Break down services to granular level as opposed to only calling ALL results.

// TracerouteResult, TracerouteResultIndividual, TRIndividualValue
//

// TO DO
tracerouteServices.factory('cytoscape', [function(){



  var cy = cytoscape({
    container: document.getElementById('tr_plot_cytoscape'),

    style: [
      {
        selector: 'node',
        style: {
          'height': 20,
          'width': 20,
          'background-color': '#30c9bc',
          'label': 'data(id)'
        }
      },

      {
        selector: 'edge',
        style: {
          'width': 3,
          'opacity': 0.8,
          'line-color': '#a8ea00',
          'target-arrow-color': 'black',
          'target-arrow-shape': 'triangle'
        }
      }
    ],

  });


  cy.add =  function add_node(ID, startNode) {

    var mainNode;
    if (startNode) {
      mainNode = "true";
    } else {
      mainNode = "false";
    }

    var node = {
      group: 'nodes',
      // 'nodes' for a node, 'edges' for an edge
      // NB the group field can be automatically inferred for you but specifying it
      // gives you nice debug messages if you mis-init elements

      // NB: id fields must be strings or numbers
      data: {
        // element data (put dev data here)
        // mandatory for each element, assigned automatically on undefined
        id: ID,
        startNode: mainNode

        // parent: 'nparent', // indicates the compound node parent id; not defined => no parent
      }


      // scratchpad data (usually temp or nonserialisable data)
      // scratch: {
      //   foo: 'bar'
      // },
      //
      // position: { // the model position of the node (optional on init, mandatory after)
      //   x: 100,
      //   y: 100
      // },
      //
      // selected: false, // whether the element is selected (default false)
      //
      // selectable: true, // whether the selection state is mutable (default true)
      //
      // locked: false, // when locked a node's position is immutable (default false)
      //
      // grabbable: true // whether the node can be grabbed and moved by the user

      // class: 'mainNode'// a space separated list of class names that the element has
    };

    // console.log("Node ID: " + ID + " created.");
    return node;
  }




}]);

tracerouteServices.factory('TracerouteMainResult_URL', ['$resource', function($resource){

  // Calls the main result page.
  // url : "http://ps2.jp.apan.net/esmond/perfsonar/archive/0a468985ca8b41029a22ae4e4645f869/"
  // metadata-key : "0a468985ca8b41029a22ae4e4645f869"
  // subject-type : "point-to-point"
  // event-types
  // source : "203.30.39.127"
  // destination : "137.189.192.25"
  // measurement-agent : "203.30.39.127"
  // tool-name : "bwctl/tracepath"
  // input-source : "203.30.39.127"
  // input-destination : "ps1.itsc.cuhk.edu.hk"
  // time-interval : "600"
  // ip-transport-protocol : "icmp"
  // ip-packet-size : "40"
  // uri : "/esmond/perfsonar/archive/0a468985ca8b41029a22ae4e4645f869/"
  // metadata-count-total : 23
  // metadata-previous-page : null
  // metadata-next-page : null


  // https://docs.angularjs.org/api/ngResource/service/$resource
  return $resource(tracerouteResultURL, {}, {

    list: {
      method:'GET',
      params:{'format':'json','event-type':'packet-trace'},
      isArray:true
    }

  });

}]);
tracerouteServices.factory('TracerouteMainResults', ['$resource', function($resource){

  // Calls the main result page.
  // url : "http://ps2.jp.apan.net/esmond/perfsonar/archive/0a468985ca8b41029a22ae4e4645f869/"
  // metadata-key : "0a468985ca8b41029a22ae4e4645f869"
  // subject-type : "point-to-point"
  // event-types
  // source : "203.30.39.127"
  // destination : "137.189.192.25"
  // measurement-agent : "203.30.39.127"
  // tool-name : "bwctl/tracepath"
  // input-source : "203.30.39.127"
  // input-destination : "ps1.itsc.cuhk.edu.hk"
  // time-interval : "600"
  // ip-transport-protocol : "icmp"
  // ip-packet-size : "40"
  // uri : "/esmond/perfsonar/archive/0a468985ca8b41029a22ae4e4645f869/"
  // metadata-count-total : 23
  // metadata-previous-page : null
  // metadata-next-page : null


  // https://docs.angularjs.org/api/ngResource/service/$resource
    return $resource(tracerouteResultURL, {}, {

      list: {
        method:'GET',
        params:{'format':'json','event-type':'packet-trace'},
        isArray:true
      }

    });

  }]);


tracerouteServices.factory('TracerouteIndividualResults', ['$resource', function($resource){

  // Calls the individual test containing various hops.

  //URL Format
  // 'http://hpc-perfsonar.usc.edu/esmond/perfsonar/archive/123AAAAAAA/packet-trace/base'
  // substitute 123AAAA with :metadata_key, similar to parameters

  return $resource(tracerouteResultIndividualURL, {}, {
    get: {
      method:'GET',
      params:{'format':'json'},
      isArray:true}


  });

}]);

