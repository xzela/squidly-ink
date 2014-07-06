var exif = require('exif'),
	fs = require('fs'),
	path = require('path'),
	config = require('../config/config.json'),
	absoluteUploadPath = require('../config/absolute-path.json'),
	Sighting = require('../schemas/sighting'),
	uuid = require('node-uuid'),
	multiparty = require('multiparty');

module.exports = function (router) {

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


	function _upload(request, response) {
		if (request.method == 'GET') {
			response.render('upload', {});
		} else {
			console.log("uploading....");
			var form = new multiparty.Form();
			var dest = absoluteUploadPath.path;

			form.on('error', function (err) {
				throw err;
			});

			form.on('close', function () {
				response.send('file uploaded');
			});

			form.on("file", function (name, file) {
				var ext = file.originalFilename.slice(file.originalFilename.lastIndexOf('.') + 1).toLowerCase();
				console.log("uploading file....");
				var new_file = path.join(dest, uuid.v1() + '.' + ext);
				fs.rename(file.path, new_file, function (err) {
					if (err) {
						throw err;
					}
					console.log('file has been moved: ' + file.path + ' -> ' + new_file);
					new exif.ExifImage({
						image: new_file
					}, function (err, data) {
						if (err) {
							throw err;
						}
						console.dir(data);
						if (data.gps) {
							var lat = __convert(data.gps.GPSLatitude[0], data.gps.GPSLatitude[1], data.gps.GPSLatitude[2]);
							var lon = __convert(data.gps.GPSLongitude[0], data.gps.GPSLongitude[1], data.gps.GPSLongitude[2]);
							if (data.gps.GPSLongitudeRef === 'W') {
								lon = lon * -1;
							}
							console.log('GPSLatitude', lat);
							console.log('GPSLongitude', lon);

							var sight = new Sighting({
								imageRelPath: path.join('img', file.originalFilename),
								imageFilePath: new_file,
								location: {
									latitude: lat,
									longitude: lon
								}
							});
							sight.save(function (err, data) {
								if (err) {
									throw err;
								}
								// response.json(sight);
							});
						} else {
							console.log("couldn't locate GPS data from image");
						}
					});
				});
			});

			form.parse(request);
		}
	}

	router
		.get('/upload', _upload)
		.post('/upload', _upload)
	;

	return router;
};
