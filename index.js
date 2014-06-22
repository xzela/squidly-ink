var express = require('express'),
	fs = require('fs'),
	config = require('./config/config.json'),
	path = require('path'),
	multiparty = require('multiparty');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function (req, res) {
	res.render('index', {});
});

app.get('/upload', function (req, res) {
	res.render('upload', {});
});

app.get('/map', function (req, res) {
	res.render('map', {apiKey: config.google.maps.key});
});

app.post('/upload', function (req, res) {
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
		});
	});

	form.parse(req);
});

app.listen(3000);
