
module.exports = function (router) {

	function _index(request, response) {
		response.render('index', {});
	}

	router
		.get('/', _index)
	;

	// sighting routes
	router = require('./sightings')(router);

	// upload routes
	router = require('./upload')(router);

	// map routes
	router = require('./map')(router);

	return router;
};
