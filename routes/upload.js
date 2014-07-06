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


	function _upload(requst, response) {
		if (request.mothod == 'GET') {
			response.render('upload', {});
		} else {

			var form = new multiparty.Form();
			var dest = path.join(__dirname, 'files');

			form.on('error', function (err) {
				throw err;
			});

			form.on('close', function () {
				res.send('file uploaded');
			});

			form.on("file", function (name, file) {
				var new_file = path.join(dest, file.originalFilename);
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
						} else {
							console.log("couldn't locate GPS data from image");
						}
					});
				});
			});
		}
	}

	router
		.get('/upload', _upload)
		.post('/upload', _upload)
	;

	return router;

};
