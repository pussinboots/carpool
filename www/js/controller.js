'use strict';
angular.module('controller', []).controller('controller', ['$scope', 'WalkerService', 'GeoService', 'RouteService', function ($scope, WalkerService, GeoService, RouteService) {
//app.controller("controller", function ($scope, GeoService){
	
	// Fetch Device info from Device Plugin
	$scope.alertDeviceInfo = function() {
		var deviceInfo = ('Device Platform: ' + device.platform + '\n'
				+ 'Device Version: ' + device.version + '\n' + 'Device Model: '
				+ device.model + '\n' + 'Device UUID: ' + device.uuid + '\n');

		navigator.notification.alert(deviceInfo);
	};

	// Fetch location info from GeoLocation Plugin
	$scope.alertGeoLocation = function() {
		var onSuccess = function(position) {
			navigator.notification.alert('Latitude: '
					+ position.coords.latitude + '\n' + 'Longitude: '
					+ position.coords.longitude + '\n' + 'Altitude: '
					+ position.coords.altitude + '\n' + 'Accuracy: '
					+ position.coords.accuracy + '\n' + 'Altitude Accuracy: '
					+ position.coords.altitudeAccuracy + '\n' + 'Heading: '
					+ position.coords.heading + '\n' + 'Timestamp: '
					+ position.timestamp + '\n');
		};
		navigator.geolocation.getCurrentPosition(onSuccess);

	};

	$scope.uploadWalkerGeoLoc = function() {
		var onSuccess = function(position) {
			WalkerService.uploadPosition({deviceId:device.uuid}, position);
		};
		navigator.geolocation.getCurrentPosition(onSuccess);

	};

	$scope.startRoute = function() {
		var onSuccess = function(position) {
			$scope.vibrateNotify();
			GeoService.uploadPosition({deviceId:device.uuid, routeId:$scope.route._id}, position);
		};
		var options = { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }
		if ($scope.watchId) {
			navigator.geolocation.clearWatch($scope.watchId);
		}
		$scope.route = RouteService.startRoute({deviceId:device.uuid},{name:'Meine neue Route'});
		$scope.watchId = navigator.geolocation.watchPosition(onSuccess, null, options);
	};

	$scope.endRoute = function() {
		RouteService.endRoute({deviceId:device.uuid},{routeId:$scope.route._id, name:"Meine neue Route"});
		if ($scope.watchId) {
			navigator.geolocation.clearWatch($scope.watchId);	
		}
	};

	// Makes a beep sound
	$scope.beepNotify = function() {
		navigator.notification.beep(1);
	};

	// Vibrates the phone
	$scope.vibrateNotify = function() {
		navigator.notification.vibrate(100);
	};
}]);