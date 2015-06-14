'use strict';

/* Services */
angular.module('service', ['ngResource'], function ($provide) {

    $provide.factory('GeoService', function ($resource) {
        return $resource('http://localhost:9000/api/walker/position',{}, {
            uploadWalkerPos: {method: 'POST', isArray:false, params:{uri:"walker/position"}}
	    });
    });
});