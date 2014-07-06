var mongoose = require('mongoose'),
	sighting = require('../schemas/sighting');

mongoose.connect('mongodb://localhost/squid');

module.exports = function (router) {

	var db = mongoose.connection;
	var Sighting = mongoose.model('Sighting', sighting);
	db.on("error", function (err) {
		throw err;
	});

	function _save(request, response) {
		var sight = new Sighting({
			location: {
				latitude: Math.random(),
				longitude: Math.random()
			}
		});
		sight.save(function (err, data) {
			if (err) {
				throw err;
			}
			response.json(sight);
		});
	}

	function _sighting(request, response) {
		Sighting.find({}, function (err, data) {
			response.json({
				data: data
			});
		});
	}

	router
		.get('/sightings', _sighting)
		.get('/sightings/save', _save)
	;

	return router;
};
