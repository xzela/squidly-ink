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

	function byLocation(location, callback) {
		var query = {
			"geoLocation.coordinates": {
				'$near': [location.lat, location.lon],
				'$maxDistance': 0.002
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
