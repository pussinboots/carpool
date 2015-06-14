// requires connect and connect-rest middleware
var connect = require('connect');
var bodyParser = require('body-parser');
var rest = require('connect-rest');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/walkerpositions');

var port = Number(process.env.PORT || 9000);

var geoSchem = mongoose.Schema({
	timestamp: Date,
	loc: {
		type: {type:String}, coordinates: {type:Array}
	},
	coords: [{ latitude: Number, longitude: Number, altitude: Number, accuracy: Number, altitudeAccuracy: Number, heading: Number, speed: Number }]
});

var Geo = mongoose.model('Geo', geoSchem);

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
	console.log( 'Received headers:' + JSON.stringify( request.headers ) );
	console.log( 'Received parameters:' + JSON.stringify( request.parameters ) );
	console.log( 'Received JSON object:' + JSON.stringify( content ) );
	callback(null,{
		status:'okay', version:'1.0.0', 
		paths:{
			status:'/api/status', 
			uploadGeoPosition:{
				driver:'/api/driver/position', 
				walker:'/api/walker/position'
			}
		}
	});
}

function uploadGeoPosition( request, content, callback ){
	console.log( 'Received headers:' + JSON.stringify( request.headers ) );
	console.log( 'Received parameters:' + JSON.stringify( request.parameters ) );
	console.log( 'Received JSON object:' + JSON.stringify( content ) );

	content.loc = {type: 'Point', coordinates : [content.coords.longitude, content.coords.latitude]};

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
rest.get( [ { path: '/status' } ], status );
rest.post( [ { path: '/driver/position' } ], uploadGeoPosition );
rest.post( [ { path: '/walker/position' } ], uploadGeoPosition );

connectApp.listen(port);