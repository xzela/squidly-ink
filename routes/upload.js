var exif = require('exif'),
	fs = require('fs'),
	path = require('path'),
	config = require('../config/config.json'),
	Sighting = require('../schemas/sighting'),
	uuid = require('node-uuid'),
	logger = require('../lib/util/log').getLogger(__filename),
	uploader = require('../lib/uploader'),
	multiparty = require('multiparty');

module.exports = function (router) {

	function _upload(request, response) {
		if (request.method == 'GET') {
			response.render('upload', {});
		} else {
			console.log("uploading....");
			var form = new multiparty.Form();
			var dest = uploader.createUTCDir();
			form.on('error', function (err) {
				throw err;
			});

			form.on('close', function () {
				response.send('file uploaded');
			});

			form.on("file", function (name, file) {
				uploader.moveFile(dest, file, uploader.parseExif);
				// var sight = new Sighting({
				// 	imageRelPath: path.join('img', file.originalFilename),
				// 	imageFilePath: new_file,
				// 	location: {
				// 		latitude: lat,
				// 		longitude: lon
				// 	}
				// });
				// sight.save(function (err, data) {
				// 	if (err) {
				// 		throw err;
				// 	}
				// 	// response.json(sight);
				// });
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
