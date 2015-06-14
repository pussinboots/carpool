'use strict';

/* Services */
angular.module('service', ['ngResource'], function ($provide) {

    $provide.factory('RouteService', function ($resource) {
        return $resource('http://localhost:9000/api/driver/route/:action/:deviceId',{}, {
        	startRoute: {method: 'POST', isArray:false, params:{action:'start'}},
            endRoute: {method: 'POST', isArray:false, params:{action:'end'}}
	    });
    });
    $provide.factory('GeoService', function ($resource) {
        return $resource('http://localhost:9000/api/driver/route/position/:routeId/:deviceId',{}, {
        	uploadPosition: {method: 'POST', isArray:false}
	    });
    });

    $provide.factory('WalkerService', function ($resource) {
        return $resource('http://localhost:9000/api/walker/position/:deviceId',{}, {
        	uploadPosition: {method: 'POST', isArray:false}
	    });
    });
});