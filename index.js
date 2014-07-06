var express = require('express'),
	fs = require('fs'),
	config = require('./config/config.json'),
	path = require('path'),
	serveStatic = require('serve-static'),
	exif = require('exif'),
	multiparty = require('multiparty');

// check to see if the uploads directory exists.
var upload_path = path.join(__dirname, config.uploadPath);
if (!fs.existsSync(upload_path)) {
	try {
		fs.mkdirSync(upload_path);
	} catch (e) {
		throw e;
	}
} else {
	if (!fs.lstatSync(upload_path).isDirectory()) {
		throw new Error("the upload path is not a directory!");
	}
}

// start up the application
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// load up the main router!
var Router = express.Router();
var router = require('./routes/index')(Router);
app.use('/', router);

app.use(serveStatic(path.join(__dirname, '/views/static')));

app.listen(3000, function () {
	console.log("listening on port: 3000");
});
