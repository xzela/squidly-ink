
module.exports = function (router) {

	function _index(request, response) {
		response.render('index', {});
	}

	router
		.get('/', _index)
	;

	router = require('./sightings')(router);

	// upload routes
	router = require('./upload')(router);

	return router;
};
