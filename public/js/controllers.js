'use strict';
function GithubController($scope, $http) {
	$http({method: 'GET', url: "https://raw.githubusercontent.com/"+$scope.$parent.projects.repo+"/"+$scope.$parent.project.name+"/master/.travis.yml"}).
	success(function(data, status, headers, config) {
		$scope.content=data;
	}).
	error(function(data, status, headers, config) {
		console.log('error')
	});
}

function SettingsController($rootScope) {

}

function DetailsController($scope, $http, Project, TravisCl, GitHubCl) {
	$scope.project=Project.get();
	console.log('selected project ' + Project.get());
	$scope.builds = function(project) {
		TravisCl.getBuilds({uri:project.slug+'/builds'}, function(data) {
			project.builds=data.builds;
		})
	}
	$scope.build = function(project) {
		project.build=TravisCl.getBuild({uri:project.slug+'/builds/'+project.last_build_id})
	}

        $scope.setbuild = function(project, buildId) {
		project.build=TravisCl.getBuild({uri:project.slug+'/builds/'+buildId})
	}
	$scope.log = function(job) {
		$http({method: 'GET', url: 'https://api.travis-ci.org/jobs/'+job.id+'/log'}).
		    success(function(data, status, headers, config) {
			job.log=data;
		    }).
		    error(function(data, status, headers, config) {
		    });
		//job.log=TravisLog.getLog({logId:job.log_id})
	}
	$scope.readme = function(project) {
		var res = project.slug.split("/");
		GitHubCl.getFile({repo:res[0], project:res[1], uri:'contents/README.md'}, function(data){
			project.readme=atob(data.content)
		})
	}
	$scope.travisyml = function(project) {
		var res = project.slug.split("/");
		GitHubCl.getFile({repo:res[0], project:res[1], uri:'contents/.travis.yml'}, function(data){
			project.travisyml=atob(data.content)
		})
	}
	$scope.commits = function(project) {
		var res = project.slug.split("/");
		project.commits=GitHubCl.getCommits({repo:res[0], project:res[1]})
	}
	$scope.build(Project.get());
}

function TravisController($scope, $timeout, TravisCl, Project, $location) {
	$scope.open=true;
	$scope.load = function() {
		$scope.travis=TravisCl.getProjects({uri:$scope.config.repo})
	}
	$scope.checkHeroku = function(project) {
		if (typeof project.description!='undefined')
			return project.description.indexOf('heroku')>=0
		return false;
	}
	$scope.select = function(project) {
		console.log('selected project overview' + project);
		Project.set(project);
		$location.path('/details');
	}
	$scope.load()
}

function JobsController($scope, $rootScope, $timeout, TravisCl, Project, $location, Pusher) {
	$scope.open=true;
	$scope.travis=$rootScope.travis;
	
	$scope.select = function(job) {
		console.log(job.repository_slug)
		TravisCl.getProject({uri:job.repository_slug}, function(data) {
			console.log('selected project overview' + data);
			Project.set(data.repo);
			$location.path('/details');
		});
	}
	//$scope.load()
	
}
