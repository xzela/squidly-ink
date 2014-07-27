var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	db,
	sightingSchema,
	Sighting;

mongoose.connect('mongodb://localhost/squid');

db = mongoose.connection;
db.on("error", function (err) {
	throw err;
});

sightingSchema = new Schema({
	imageRelPath: String,
	imageFilePath: String,
	date: {type: Date, default: Date.now },
	location: {
		latitude: Number,
		longitude: Number,
	},
	geoLocation: {
		'type': {type: String},
		coordinates: [Number]
	},
	tags: [Schema.Types.Mixed]
});

Sighting = mongoose.model('Sighting', sightingSchema);

module.exports = Sighting;
