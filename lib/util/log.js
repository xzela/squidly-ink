var fs = require('fs'),
	path = require('path'),
	log4js = require('log4js'),
	config = require('../../config/config.json'),
	util = require('./util'),
	level = config.log.level;

// load the file appender
log4js.loadAppender('file');

// load configuration
log4js.addAppender(log4js.appenders.file(path.join(config.log.path, config.log.filename)));

// checks to see if we're in running unit/functional tests
if (process.env.NODE_ENV === 'tester') {
	level = "error";
}

log4js.setGlobalLogLevel(level);

/**
 * exposes the log4js object
 */
module.exports = log4js;
