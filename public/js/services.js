'use strict';

/* Services */

angular.module('services', ['ngResource'], function ($provide) {

    $provide.factory('TravisCl', function ($resource) {
        return $resource('https://api.travis-ci.org/repos/:uri',{}, {
            getProjects: {method: 'GET', isArray:false, params:{uri:":repo"}, headers:{'Accept':'application/vnd.travis-ci.2+json'} },
	    getProject: {method: 'GET', isArray:false, params:{uri:":repo/:project"}, headers:{'Accept':'application/vnd.travis-ci.2+json'}, decodeuri:true},
            getBuilds: {method: 'GET', isArray:false, params:{uri:":slug/builds"}, decodeuri: true, headers:{'Accept':'application/vnd.travis-ci.2+json'}},
	    getBuild: {method: 'GET', isArray:false, params:{uri:":slug/build/:buildId"}, decodeuri: true, headers:{'Accept':'application/vnd.travis-ci.2+json'}}
        });
    });

    $provide.factory('GitHubCl', function ($resource) {
        return $resource('https://api.github.com/repos/:repo/:project/:uri', {}, {
            getCommits: {method: 'GET', isArray:true, params:{uri:'commits'}, decodeuri: true},
            getFile: {method: 'GET', isArray:false, params:{uri:'contents/:file'}, decodeuri: true}
        });
    });

    $provide.factory('Project', function () {
        var property;

        return {
            get: function () {
                return property;
            },
            set: function(value) {
                property = value;
            }
        };
    });
});
