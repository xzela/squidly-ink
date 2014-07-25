var imager = require('../lib/imager');

module.exports = function (router) {

	function _index(request, response) {
		response.render('index', {});
	}

	function _resize(request, response) {
		imager.resize('/Users/zephlafassett/Documents/git-repos/squidly.ink/uploads/something/foo/2014/6/17/56113e80-0d46-11e4-86ec-a3b49c248515.jpg', [500, 500]);
		response.send('done?');
	}

	router
		.get('/', _index)
		.get('/resize', _resize)
	;

	// sighting routes
	router = require('./sightings')(router);

	// upload routes
	router = require('./upload')(router);

	// map routes
	router = require('./map')(router);

	// test routes
	router = require('./test-route')(router);

	return router;
};
