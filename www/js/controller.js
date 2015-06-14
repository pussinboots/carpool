'use strict';
angular.module('controller', []).controller('controller', ['$scope', 'GeoService', function ($scope, GeoService) {
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
			GeoService.uploadWalkerPos(position);
		};
		navigator.geolocation.getCurrentPosition(onSuccess);

	};

	$scope.watchWalkerGeoLoc = function() {
		var onSuccess = function(position) {
			$scope.vibrateNotify();
			GeoService.uploadWalkerPos(position);
		};
		var options = { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }
		if ($scope.watchId) {
			navigator.geolocation.clearWatch($scope.watchId);
		}
		$scope.watchId = navigator.geolocation.watchPosition(onSuccess, null, options);

	};

	$scope.stopWatchGeoLoc = function() {
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