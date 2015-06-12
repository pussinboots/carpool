'use strict';

/* App Module */
var demoApp = angular.module('demoApp', ['services', 'DataTable', 'ngRoute', 'oauth', 'ngClipboard', 'mobile-angular-ui', 'angularjs-decode-uri', 'doowb.angular-pusher']);

demoApp.config(function ($routeProvider) {
	$routeProvider
	.when('/travis', { templateUrl: 'partials/overview.html', controller: TravisController})
	.when('/jobs', { templateUrl: 'partials/jobs.html', controller: JobsController})
	.when('/details', { templateUrl: 'partials/details.html', controller: DetailsController})
	.when('/settings', { templateUrl: 'partials/settings.html', controller: SettingsController})
	.when('/new', { templateUrl: 'partials/new-project.html', controller: TravisController})
	.otherwise({ redirectTo: '/travis' });
});

demoApp.config(['PusherServiceProvider',
  function(PusherServiceProvider) {
   PusherServiceProvider
      .setToken('5df8ac576dcccf4fd076')
      .setOptions({encrypted:false});
  }
]);


demoApp.run(function ($rootScope, $timeout, Pusher) {

	$rootScope.config = {
		repo: 'pussinboots',
		interval: 20000,
		reloadActivated:0,
		jobmonitoring:0,
		jobfilter: 0
	};
	$rootScope.travis={repos:[]};
	$rootScope.activateReload = function(reloadActivated) {
		console.log("check reload "+ reloadActivated)
		$rootScope.config.reloadActivated=reloadActivated;
		if(reloadActivated) {
			console.log("perform reload")
			$rootScope.reloadpic(reloadActivated);
		}
	}
	$rootScope.reloadpic =function(reloadActivated)
	{
		var interval = $rootScope.config.interval
		$rootScope.rand = new Date().getTime();
		if (interval<10000) {
			interval=10000
		}
		$rootScope.$apply();
		console.log("reload " + reloadActivated)
		if(reloadActivated) {
			$timeout(function() {
				$rootScope.reloadpic($rootScope.config.reloadActivated);
			}, interval);
		}
	}
	$rootScope.activateSubcribe= function(monitoring) {
		if(monitoring) {
			$rootScope.subcribesJob();
		} else {
			$rootScope.unsubcribesJob();
		}
	}
	$rootScope.activateJobFilter= function(jobFilter) {
		$rootScope.config.jobFilter=jobFilter;
		$rootScope.travis.repos.length=0;
		$rootScope.$apply();
	}
	$rootScope.subcribesJob = function() {
		console.log('subcribe to pusher');
		Pusher.subscribe('common','job:started', $rootScope.receiveJob);
		Pusher.subscribe('common','job:finished', $rootScope.receiveJob);
		Pusher.subscribe('common','job:requeued', $rootScope.receiveJob);
	}
	$rootScope.unsubcribesJob = function() {
		console.log('unsubcribe to pusher');
		Pusher.unsubscribe('common');
	}

	$rootScope.receiveJob = function(data){
		if ($rootScope.travis.repos.length >= 20) {
			$rootScope.travis.repos.pop();	
		}
		if(filterJob(data)) {
			$rootScope.travis.repos.unshift(data)
		}	
        }
	function filterJob(data) {
		if($rootScope.config.jobFilter) {
			return data.repository_slug.beginsWith($rootScope.config.repo)
		}
		return true;
	}
});

String.prototype.beginsWith = function (string) {
    if(typeof string == 'undefined') return true
    return(this.indexOf(string) === 0);
};
