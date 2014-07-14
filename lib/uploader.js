var exif = require('exif'),
	fs = require('fs'),
	util = require('./util/util'),
	path = require('path'),
	uuid = require('node-uuid'),
	config = require('../config/config.json'),
	logger = require('./util/log').getLogger(__filename);

function uploader() {
	var publicAPI;

	function __convert(deg, min, sec) {
		var azi;
		if (deg < 0) {
			azi = -1.0 * deg + 1.0 * min / 60.0 + 1.0 * sec / 3600.0;
			return -1.0 * azi;
		} else {
			azi = 1.0 * deg + 1.0 * min / 60.0 + 1.0 * sec / 3600.0;
			return azi;
		}
	}

	function _getUTCDir() {
		var d = new Date();
		return path.join(d.getUTCFullYear().toString(), d.getUTCMonth().toString(), d.getUTCDate().toString());
	}

	function createUTCDir() {
		var d_path = _getUTCDir();
		return util.checkOrCreatePath(path.join(config.uploadPath, d_path));
	}

	function moveFile(destination, file, callback) {
		console.log(_getUTCDir());
		var obj = {

			fileName: uuid.v1() + path.extname(file.originalFilename.toLowerCase())
		};
		obj['realPath'] = path.join(destination, obj.fileName);
		obj['imageRelPath'] = path.join('img', _getUTCDir(), obj.fileName);
		fs.rename(file.path, obj.realPath, function (err) {
			if (err) {
				throw err;
			}
			return callback(obj);
		});
	}

	function parseExif(filePath) {
		var location = {};
		return new exif.ExifImage({ image: filePath}, function (err, data) {
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
				return location;
			}
		);
	}

	publicAPI = {
		createUTCDir: createUTCDir,
		moveFile: moveFile,
		parseExif: parseExif
	};
	return publicAPI;
}

var exports = module.exports = uploader();
