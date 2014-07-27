var config = require('../config/config.json'),
	squidling = require('../lib/squidling'),
	Sighting = require('../schemas/sighting');

module.exports = function (router) {
	'use strict';
	function _map(request, response) {
		// 53b996a78d5aac0000f57211 -- bad
		// 53b9d69c5300c10000d7ff94 -- good!
		squidling.byId('53c72078d6d7280000e734e1', function (err, data) {
			if (err) {
				throw err;
			}
			data = data || {location: {latitude: 37.762, longitude: -122.4152}};
			response.render('map', {
				apiKey: config.google.maps.key,
				data: data
			});
		});
	}

	router
		.get('/map', _map)
	;
	return router;
};
