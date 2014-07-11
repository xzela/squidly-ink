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

	function createUTCDir() {
		var d = new Date();
		var d_path = path.join(d.getUTCFullYear().toString(), d.getUTCMonth().toString(), d.getUTCDate().toString());
		return util.checkOrCreatePath(path.join(config.uploadPath, d_path));
	}

	function moveFile(destination, file, callback) {
		var new_file = path.join(destination, uuid.v1() + '.' + path.extname(file.originalFilename));
		fs.rename(file.path, new_file, function (err) {
			if (err) {
				throw err;
			}
			callback(new_file);
		});
	}

	function parseExif(filePath, callback) {
		new exif.ExifImage({
				image: filePath
			},
			function (err, data) {
				if (err) {
					throw err;
				}
				// console.dir(data);
				if (data.gps) {
					var lat = __convert(data.gps.GPSLatitude[0], data.gps.GPSLatitude[1], data.gps.GPSLatitude[2]);
					var lon = __convert(data.gps.GPSLongitude[0], data.gps.GPSLongitude[1], data.gps.GPSLongitude[2]);
					if (data.gps.GPSLongitudeRef === 'W') {
						lon = lon * -1;
					}
					console.log('GPSLatitude', lat);
					console.log('GPSLongitude', lon);
				}
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
