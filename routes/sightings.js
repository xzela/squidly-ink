var logger = require('../lib/util/log').getLogger(__filename),
	Sighting = require('../schemas/sighting');

module.exports = function (router) {

	function _save(request, response) {
		var sight = new Sighting({
			location: {
				latitude: Math.random(),
				longitude: Math.random()
			},
			geoLocation: {
				type: 'Point',
				coordinates: [Math.random(), Math.random()]
			}
		});
		logger.error(sight);
		sight.save(function (err, data) {
			if (err) {
				throw err;
			}
			response.json(sight);
		});
	}

	function _sighting(request, response) {
		if (request.params.id) {
			Sighting.find({_id: request.params.id}, function (err, data) {
				response.json({
					data: data
				});
			});
		} else {
			Sighting.find({}, function (err, data) {
				response.json({
					data: data
				});
			});
		}
	}

	router
		.get('/sightings', _sighting)
		.get('/sightings/save', _save)
		.get('/sightings/id/:id', _sighting)

	;

	return router;
};
