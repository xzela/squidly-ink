var fs = require('fs'),
	path = require('path');

function util() {
	var publicAPI;

	/**
	 * [createDir description]
	 *
	 * @param  {[type]} _path [description]
	 *
	 * @return {[type]}       [description]
	 */
	function createDir(_path) {
		if (!fs.existsSync(_path)) {
			try {
				fs.mkdirSync(_path);
				return true;
			} catch (e) {
				throw e;
			}
		} else {
			if (!fs.lstatSync(_path).isDirectory()) {
				throw new Error("the upload path is not a directory!");
			}
			return true;
		}
	}

	/**
	 * [checkOrCreatePath description]
	 *
	 * @param  {[type]} _path [description]
	 *
	 * @return {[type]}       [description]
	 */
	function checkOrCreatePath(_path) {
		var dirs = _path.split(path.sep),
			last = '',
			p, bool;
		for (var i = 0; i < dirs.length; i++) {
			p = path.resolve(path.join(last, dirs[i]));
			bool = createDir(p);
			last = path.join(last, dirs[i]);
		}
		return path.resolve(_path);
	}

	publicAPI = {
		checkOrCreatePath: checkOrCreatePath
	};
	return publicAPI;
}

var exports = module.exports = util();
