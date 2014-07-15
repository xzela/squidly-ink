var imager = require('../lib/imager');

module.exports = function (router) {

	function _index(request, response) {
		response.render('index', {});
	}

	function _resize(request, response) {
		imager.resize('/Users/zephlafassett/Documents/git-repos/squidly.ink/uploads/something/foo/2014/6/15/9bfebd30-0c44-11e4-a394-c7a525bd08f3.jpg');
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

	return router;
};
