// requires connect and connect-rest middleware
var connect = require('connect'),
rest = require('connect-rest'),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
ObjectId = mongoose.Schema.Types.ObjectId;

var port = Number(process.env.PORT || 9000);
var mongoURL = process.env.MONGOLAB_URI || 'mongodb://localhost/carpool';

console.log(mongoURL);
mongoose.connect(mongoURL);

var geoSchem = mongoose.Schema({
	timestamp: Date, routeId: ObjectId,
	deviceId: String, loc: {type: {type:String}, coordinates: {type:Array, index:'2d'} },
	coords: { latitude: Number, longitude: Number, altitude: Number, accuracy: Number, altitudeAccuracy: Number, heading: Number, speed: Number }
});

var deviceSchem = mongoose.Schema({
	timestamp: Date, deviceId: String, plattform: String, model: String
});

var positionSchem = mongoose.Schema({
	timestamp: Date, deviceId: String,
	loc: {type: {type:String}, coordinates: {type:Array, index:'2d'}},
	coords: { latitude: Number, longitude: Number, altitude: Number, accuracy: Number, altitudeAccuracy: Number, heading: Number, speed: Number }
});

var routeSchem = mongoose.Schema({
	timestamp: { type: Date, default: Date.now }, status: String, deviceId: String, name:{ type: String, default: 'new route' }
});

var Geo = mongoose.model('Geo', geoSchem);
var Route = mongoose.model('Route', routeSchem);
var Position = mongoose.model('Position', positionSchem);
//not used at the moment later for device registration
var Device = mongoose.model('Device', deviceSchem);





// sets up connect and adds other middlewares to parse query, parameters, content and session
// use the ones you need
var connectApp = connect()
.use( bodyParser.urlencoded( { extended: true } ) )
.use( bodyParser.json() );

// initial configuration of connect-rest. all-of-them are optional.
// default context is /api, all services are off by default
var options = {
	context: '/api',
	logger:{ file: 'mochaTest.log', level: 'debug' },
	//apiKeys: [ '849b7648-14b8-4154-9ef2-8d1dc4c2b7e9' ],
	discoverPath: 'discover',
	protoPath: 'proto'
};

// adds connect-rest middleware to connect
connectApp.use( rest.rester( options ) );

function status( request, content, callback ){
	log(request, content);
	callback(null,{
		status:'okay', version:'1.0.0', 
		paths:{
			status:{url:'/api/status', method:'get'}, 
			uploadGeoPosition:{
				driver:{
					route:{
						start:{url: '/api/driver/route/start/:deviceId', method:'post'},
						end:{url:'/api/driver/route/end/:deviceId', method:'post'},
						position:{url:'/driver/route/position/:routeId/:deviceId', method:'post'}
					},
				},
				walker:{
					position:{url:'/api/walker/position', method:'post'}
				}
			}
		}
	});
}

function log(request, content) {
	console.log( 'Received headers:' + JSON.stringify( request.headers ) );
	console.log( 'Received parameters:' + JSON.stringify( request.parameters ) );
	console.log( 'Received JSON object:' + JSON.stringify( content ) );
}

function startRoute( request, content, callback ){
	log(request, content);
	var deviceId = request.parameters.deviceId;
	var route = new Route({ name: 'new route', deviceId: deviceId, status:'created' });
	route.save(function (err) {
	  if (err) console.log(err);
	});
    console.log('route  ' + JSON.stringify(route));
    callback(null, route);
}

function endRoute( request, content, callback ){
	log(request, content);
	var deviceId = request.parameters.deviceId;
	var routeId = request.parameters.routeId;
	Route.update({
    "_id": mongoose.Types.ObjectId(content.routeId)
	}, {
	    "status": "end",
	    "name": content.name
	}, function(err, route) {
	    if (err) // handleerr
	    	console.log(err);
	    console.log(JSON.stringify(route));
		callback(null, 'ok');	    
	});
}

function updateRoutePosition( request, content, callback ){
	log(request, content);
	var deviceId = request.parameters.deviceId;
	var routeId = request.parameters.routeId;
    content.loc = {type: 'Point', coordinates : [content.coords.longitude, content.coords.latitude]};
    content.deviceId = deviceId;
    content.routeId = routeId;
    Geo.create(content, function (err, geo) {
	  if (err) {
	  	console.log(err);
	  	callback(null, err);
	  } else {
	  	callback(null, 'ok');
	  }
	  // saved!
	});
}

function updatePosition( request, content, callback ){
	log(request, content);
	var deviceId = request.parameters.deviceId;
    content.loc = {type: 'Point', coordinates : [content.coords.longitude, content.coords.latitude]};
    content.deviceId = deviceId;
    Position.create(content, function (err, geo) {
	  if (err) {
	  	console.log(err);
	  	callback(null, err);
	  } else {
	  	console.log(JSON.stringify( geo));
	  	callback(null, 'ok');
	  }
	  // saved!
	});
}

function findNearDrivers( request, content, callback ){
	log(request, content);
	if(!request.parameters.maxDistance) 
		request.parameters.maxDistance = 5000;
	console.log("longitude" + request.parameters.longitude);
	console.log("latitude" + request.parameters.latitude);
    Geo.find({
		   loc: {
		     $near: {
		       $geometry: { type: 'Point', coordinates: [request.parameters.longitude, request.parameters.latitude] },
		       $maxDistance: parseInt(request.parameters.maxDistance)
		     }
		   }}
    	, function (err, geo) {
	  if (err) {
	  	console.log(err);
	  	callback(null, err);
	  } else {
	  	console.log(JSON.stringify( geo));
	  	callback(null, geo);
	  }
	  // saved!
	});
}

rest.get( [ { path: '/status' } ], status );
rest.post( [ { path: '/driver/route/start/:deviceId' } ], startRoute );
rest.post( [ { path: '/driver/route/position/:routeId/:deviceId' } ], updateRoutePosition );
rest.post( [ { path: '/driver/route/end/:deviceId' } ], endRoute );
rest.post( [ { path: '/walker/position/:deviceId' } ], updatePosition );
rest.get( [ { path: '/walker/find/:deviceId' } ], findNearDrivers );

connectApp.listen(port);