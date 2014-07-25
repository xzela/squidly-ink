var logger = require('../lib/util/log').getLogger(__filename);

module.exports = function (router) {

	function _next(res, response, next) {
		// logger.debug(arguments);
		next();
	}

	function _index(request, response) {
		response.render('test', {});
	}

	router
		.get('/test/list', _next, _index)
	;
	return router;
};
