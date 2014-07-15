var express = require('express'),
	serveStatic = require('serve-static'),
	fs = require('fs'),
	path = require('path'),
	util = require('./lib/util/util'),
	logger = require('./lib/util/log').getLogger(__filename),
	config = require('./config/config.json');


// check to see if the uploads directory exists.
var upload_path = path.join(config.uploadPath);
util.checkOrCreatePath(upload_path);

// start up the application
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// load up the main router!
var Router = express.Router();
var router = require('./routes/index')(Router);
app.use('/', router);

app.use('/', serveStatic(path.join(__dirname, '/views/static')));
app.use('/img', serveStatic(path.join(__dirname, config.uploadPath)));

app.listen(3000, function () {
	logger.info("listening on port: 3000");
});
