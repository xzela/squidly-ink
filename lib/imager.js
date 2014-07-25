var config = require('../config/config.json'),
	fs = require('fs'),
	gm = require('gm'),
	logger = require('./util/log').getLogger(__filename),
	path = require('path'),
	util = require('./util/util');

function imager() {
	var publicAPI;

	/**
	 * [resize description]
	 *
	 * @param  {[type]} filepath [description]
	 * @param  {[type]} size     [description]
	 *
	 * @return {[type]}          [description]
	 */
	function resize(filepath, size) {
		var ext = path.extname(filepath),
			filename = path.basename(filepath, ext),
			source = filepath.replace(filename + ext, ''),
			dest = path.join(source, filename + '-' + size.join('x') + ext);
		logger.debug(filename);
		logger.debug(ext);
		logger.debug(dest);

		gm(filepath).options({imageMagick: true}).resize(size[0], size[1]).write(dest, function (err, data) {
			if (err) {
				throw err;
			}
			logger.info(data);
		});
	}

	publicAPI = {
		resize: resize
	};
	return publicAPI;
}

var exports = module.exports = imager();
