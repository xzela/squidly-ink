var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sighting = new Schema({
	date: {type: Date, default: Date.now },
	location: {
		latitude: Number,
		longitude: Number,
	},
	tags: [Schema.Types.Mixed]
});

module.exports = sighting;
