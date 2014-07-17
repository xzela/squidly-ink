var exif = require('exif'),
	fs = require('fs'),
	util = require('./util/util'),
	path = require('path'),
	uuid = require('node-uuid'),
	config = require('../config/config.json'),
	logger = require('./util/log').getLogger(__filename);

function uploader() {
	var publicAPI;

	/**
	 * [__convert description]
	 *
	 * @param  {[type]} deg [description]
	 * @param  {[type]} min [description]
	 * @param  {[type]} sec [description]
	 *
	 * @return {[type]}     [description]
	 */
	function __convert(deg, min, sec) {
		var dec;
		if (deg < 0) {
			dec = -1.0 * deg + 1.0 * min / 60.0 + 1.0 * sec / 3600.0;
			return -1.0 * dec;
		} else {
			dec = 1.0 * deg + 1.0 * min / 60.0 + 1.0 * sec / 3600.0;
			return dec;
		}
	}

	/**
	 * [_getUTCDir description]
	 *
	 * @return {[type]} [description]
	 */
	function _getUTCDir() {
		var d = new Date();
		return path.join(d.getUTCFullYear().toString(), d.getUTCMonth().toString(), d.getUTCDate().toString());
	}

	/**
	 * [createUTCDir description]
	 *
	 * @return {[type]} [description]
	 */
	function createUTCDir() {
		var d_path = _getUTCDir();
		return util.checkOrCreatePath(path.join(config.uploadPath, d_path));
	}

	/**
	 * [moveFile description]
	 *
	 * @param  {[type]}   file        [description]
	 * @param  {Function} callback    [description]
	 *
	 * @return {[type]}               [description]
	 */
	function uploadFile(file, callback) {
		var uuidd = uuid.v1(),
			obj = {
			fileName: uuidd + path.extname(file.originalFilename.toLowerCase())
		};

		destination = path.join(config.uploadPath, _getUTCDir(), uuidd);
		util.checkOrCreatePath(destination);
		obj['realPath'] = path.join(destination, obj.fileName);
		logger.info(obj['realPath']);
		obj['imageRelPath'] = path.join('img', _getUTCDir(), uuidd, obj.fileName);
		fs.rename(file.path, obj.realPath, function (err) {
			if (err) {
				throw err;
			}
			callback(obj);
		});
	}

	/**
	 * [parseExif description]
	 *
	 * @param  {[type]}   filePath [description]
	 * @param  {Function} callback [description]
	 *
	 * @return {[type]}            [description]
	 */
	function parseExif(filePath, callback) {
		var location = {};
		new exif.ExifImage({ image: filePath}, function (err, data) {
				if (err) {
					throw err;
				}
				// console.dir(data);
				if (data.gps) {
					location['latitude'] = __convert(data.gps.GPSLatitude[0], data.gps.GPSLatitude[1], data.gps.GPSLatitude[2]);
					location['longitude'] = __convert(data.gps.GPSLongitude[0], data.gps.GPSLongitude[1], data.gps.GPSLongitude[2]);
					if (data.gps.GPSLongitudeRef === 'W') {
						location['longitude'] = location['longitude'] * -1;
					}
					console.log('GPSLatitude', location['latitude']);
					console.log('GPSLongitude', location['longitude']);
				}
				callback(location);
			}
		);
	}

	publicAPI = {
		createUTCDir: createUTCDir,
		uploadFile: uploadFile,
		parseExif: parseExif
	};
	return publicAPI;
}

var exports = module.exports = uploader();
