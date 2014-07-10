var fs = require('fs'),
	path = require('path'),
	log4js = require('log4js'),
	config = require('../../config/config.json'),
	level = config.log.level;

// load the file appender
log4js.loadAppender('file');

if (!fs.existsSync(config.log.path)) {
	try {
		fs.mkdirSync(config.log.path);
	} catch (e) {
		throw e;
	}
} else {
	if (!fs.lstatSync(config.log.path).isDirectory()) {
		throw new Error("the log path is not a directory!");
	}
}

// load configuration
log4js.addAppender(log4js.appenders.file(path.join(config.log.path, config.log.filename)));

// checks to see if we're in running unit/functional tests
if (process.env.NODE_ENV === 'tester') {
	level = "error";
}

// we're setting debug for the beta phase
// TODO remove this block of code
if (process.env.NODE_ENV === 'production') {
	level = 'debug';
}
log4js.setGlobalLogLevel(level);

/**
 * exposes the log4js object
 */
module.exports = log4js;
