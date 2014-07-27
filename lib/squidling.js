var logger = require('./util/log').getLogger(__filename),
	Sighting = require('../schemas/sighting');

function squidling(options) {
	'use strict';

	options = options || {};
	var LIMIT = 20,
		publicAPI;

	function byId(id, callback) {
		Sighting.findOne({_id: id}, function (err, data) {
			if (err) {
				callback(err);
			} else {
				callback(null, data);
			}
		});
	}

	function byLocation(location, maxDistance, callback) {
		var query = {
			"geoLocation.coordinates": {
				'$near': [location.lat, location.lng],
				'$maxDistance': maxDistance
			}
		};
		Sighting.find(query, function (err, data) {
			if (err) {
				callback(err);
			} else {
				callback(null, data);
			}
		});
	}

	publicAPI = {
		byId: byId,
		byLocation: byLocation
	};

	return publicAPI;

}

var exports = module.exports = squidling();
