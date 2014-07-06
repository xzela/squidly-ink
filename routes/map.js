var config = require('../config/config.json'),
	Sighting = require('../schemas/sighting');

module.exports = function (router) {

	function _map(request, response) {
		// 53b996a78d5aac0000f57211 -- bad
		// 53b9d69c5300c10000d7ff94 -- good!
		Sighting.findOne({_id: '53b9d69c5300c10000d7ff94'}, function (err, data) {
			if (err) {
				throw err;
			}
			console.dir(data);
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
