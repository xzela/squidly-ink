var exif = require('exif'),
	fs = require('fs'),
	path = require('path'),
	config = require('../config/config.json'),
	Sighting = require('../schemas/sighting'),
	logger = require('../lib/util/log').getLogger(__filename),
	uploader = require('../lib/uploader'),
	multiparty = require('multiparty');

module.exports = function (router) {

	function _upload(request, response) {
		if (request.method == 'GET') {
			response.render('upload', {});
		} else {
			var form = new multiparty.Form();
			form.on('error', function (err) {
				throw err;
			});

			form.on('close', function () {
				response.send('file uploaded');
			});

			form.on("file", function (name, file) {
				uploader.uploadFile(file, function (fileObj) {
					uploader.parseExif(fileObj.realPath, function (location) {
						var sight = new Sighting({
							imageRelPath: fileObj.imageRelPath,
							imageFilePath: fileObj.realPath,
							location: location,
							geoLocation: {
								type: 'Point',
								coordinates: [location.latitude, location.longitude]
							}
						});
						sight.save(function (err, data) {
							if (err) {
								throw err;
							}
						});
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
