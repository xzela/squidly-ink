var config = require('../config/config.json'),
	fs = require('fs'),
	gm = require('gm'),
	logger = require('./util/log').getLogger(__filename),
	path = require('path'),
	util = require('./util/util');

function imager() {
	var publicAPI;

	function resize(filepath) {
		gm(filepath).options({imageMagick: true}).resize(500, 500).write(filepath + 's', function (err) {
			if (err) {
				throw err;
			}
		});
	}

	publicAPI = {
		resize: resize
	};
	return publicAPI;
}

var exports = module.exports = imager();
