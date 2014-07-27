var logger = require('../lib/util/log').getLogger(__filename),
	squidling = require('../lib/squidling'),
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

	function _near(request, response) {
		if (request.body) {
			var location = {lat: request.body.lat, lng: request.body.lng};
			squidling.byLocation(location, request.body.max, function (err, data) {
				if (err) {
					throw err;
				}
				response.json(data);
			});
		} else {
			response.json({});
		}
		// 37.762, -122.4152
	}

	function _nearGet(request, response) {
		// 37.762, -122.4152
		squidling.byLocation({lat: 37.762, lng: -122.4152}, function (err, data) {
			if (err) {
				throw err;
			}
			response.json(data);
		});
	}


	router
		.get('/sightings', _sighting)
		.post('/sightings/near', _near)
		.get('/sightings/near', _nearGet)
		.get('/sightings/save', _save)
		.get('/sightings/id/:id', _sighting)

	;

	return router;
};
