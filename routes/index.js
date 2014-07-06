
module.exports = function (router) {

	function _index(request, response) {
		response.render('index', {});
	}

	router
		.get('/', _index);

	// upload routes
	router = require('./upload')(router);

	return router;
};
