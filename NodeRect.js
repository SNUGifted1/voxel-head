var NodeConf = require(__dirname + '/NodeConf.js')();

var Node = {
	requireChild: null,

	requireCrypto: null,

	requireFs: null,

	requireHttp: null,

	requireHttps: null,

	requirePath: null,

	requireZlib: null,

	init: function() {
		{
			Node.requireChild = require('child_process');
		}

		{
			Node.requireCrypto = require('crypto');
		}

		{
			Node.requireFs = require('fs');
		}

		{
			Node.requireHttp = require('http');
		}

		{
			Node.requireHttps = require('https');
		}

		{
			Node.requirePath = require('path');
		}

		{
			Node.requireZlib = require('zlib');
		}
	},

	dispel: function() {
		{
			Node.requireChild = null;
		}

		{
			Node.requireCrypto = null;
		}

		{
			Node.requireFs = null;
		}

		{
			Node.requireHttp = null;
		}

		{
			Node.requireHttps = null;
		}

		{
			Node.requirePath = null;
		}

		{
			Node.requireZlib = null;
		}
	},

	log: function(strData) {
		var strLog = [];

		{
			strLog.push((new Date().toISOString() + new Array(30).join(' ')).substr(0, 30));
		}

		{
			for (var intFor1 = 0; intFor1 < strData.length; intFor1 += 1) {
				strLog.push((strData[intFor1] + new Array(30).join(' ')).substr(0, 30));
			}
		}

		{
			console.log(strLog.join(' | '));
		}
	},

	hashbase: function(strData) {
		var objectHash = Node.requireCrypto.createHash('sha512');

		{
			objectHash.update(strData);
		}

		var strBase = objectHash.digest('base64');

		{
			strBase = strBase.replace(new RegExp('\\+', 'g'), '');
			strBase = strBase.replace(new RegExp('\\/', 'g'), '');
		}

		return strBase;
	},

	attrget: function(strStorage, strAttribute) {
		var objectData = {};

		{
			var strData = Node.requireFs.readFileSync(__dirname + '/' + strStorage + '.attr').toString();

			if (strData === '') {
				strData = '{}';
			}

			objectData = JSON.parse(strData);
		}

		return objectData[strAttribute];
	},

	attrput: function(strStorage, strAttribute, objectValue) {
		var objectData = {};

		{
			var strData = Node.requireFs.readFileSync(__dirname + '/' + strStorage + '.attr').toString();

			if (strData === '') {
				strData = '{}';
			}

			objectData = JSON.parse(strData);
		}

		{
			objectData[strAttribute] = objectValue;
		}

		{
			var strData = JSON.stringify(objectData);

			if (strData === '') {
				strData = '{}';
			}

			Node.requireFs.writeFileSync(__dirname + '/' + strStorage + '.attr', strData);
		}
	}
};

var Aws = {
	requireAws: null,

	objectStorage: null,

	objectMessage: null,

	init: function() {
		{
			Aws.requireAws = require('aws-sdk');

			Aws.requireAws.config.update({
				'accessKeyId': NodeConf.strAwsIdent,
				'secretAccessKey': NodeConf.strAwsKey,
				'region': 'us-east-1'
			});
		}

		{
			Aws.objectStorage = new Aws.requireAws.S3();
		}

		{
			Aws.objectMessage = new Aws.requireAws.SES();
		}
	},

	dispel: function() {
		{
			Aws.requireAws = null;
		}

		{
			Aws.objectStorage = null;
		}

		{
			Aws.objectMessage = null;
		}
	}
};

var Express = {
	requireExpress: null,

	requireCompression: null,

	requireSession: null,

	requireConnect: null,

	objectServer: null,

	objectHttp: null,

	init: function() {
		{
			Express.requireExpress = require('express');
		}

		{
			Express.requireCompression = require('compression');
		}

		{
			if (NodeConf.strExpressSession === 'sessionMemory') {
				Express.requireSession = require('express-session');

			} else if (NodeConf.strExpressSession === 'sessionPostgres') {
				Express.requireSession = require('express-session');

				Express.requireConnect = require('connect-pg-simple')(Express.requireSession);

			}
		}

		{
			Express.objectServer = Express.requireExpress();
		}

		{
			Express.objectHttp = null;
		}
	},

	dispel: function() {
		{
			Express.requireExpress = null;
		}

		{
			Express.requireCompression = null;
		}

		{
			Express.requireSession = null;
		}

		{
			Express.requireConnect = null;
		}

		{
			Express.objectServer = null;
		}

		{
			Express.objectHttp = null;
		}
	},

	run: function() {
		{
			Express.objectServer.set('x-powered-by', false);
			Express.objectServer.set('trust proxy', true);

			Express.objectServer.use(Express.requireCompression({
				'threshold': 0
			}));

			Express.objectServer.use(function(objectRequest, objectResponse, functionNext) {
				objectRequest.strIp = objectRequest.ip;

				if (objectRequest.strIp.toLowerCase().indexOf('::ffff:') === 0) {
					objectRequest.strIp = objectRequest.strIp.substr(7);
				}

				functionNext();
			});
		}

		{
			if (NodeConf.strExpressSession === 'sessionMemory') {
				Express.objectServer.use(Express.requireSession({
					'secret': NodeConf.strExpressSecret,
					'resave': false,
					'saveUninitialized': true,
					'cookie': {
						'maxAge': 31 * 24 * 60 * 60 * 1000
					}
				}));

			} else if (NodeConf.strExpressSession === 'sessionPostgres') {
				Express.objectServer.use(Express.requireSession({
					'secret': NodeConf.strExpressSecret,
					'resave': false,
					'saveUninitialized': true,
					'cookie': {
						'maxAge': 31 * 24 * 60 * 60 * 1000
					},
					'store': new Express.requireConnect({
						'pg': Postgres.requirePg,
						'conString': NodeConf.strPostgresServer,
						'tableName': 'Session'
					})
				}));

			}
		}

		{
			Express.objectHttp = Express.objectServer.listen(NodeConf.intExpressPort);
		}

		{
			var functionInterval = function() {
				var FilesystemRead_strFiles = [];

				var functionFilesystemRead = function() {
					Node.requireFs.readdir(__dirname + '/tmp', function(objectError, strFiles) {
						if (objectError !== null) {
							functionError();

							return;
						}

						{
							for (var intFor1 = 0; intFor1 < strFiles.length; intFor1 += 1) {
								FilesystemRead_strFiles.push(strFiles[intFor1]);
							}
						}

						functionFilesystemStatIterator(null);
					});
				};

				var FilesystemStatIterator_intIndex = 0;

				var functionFilesystemStatIterator = function(intIncrement) {
					{
						if (intIncrement === null) {
							FilesystemStatIterator_intIndex = 0;

						} else if (intIncrement !== null) {
							FilesystemStatIterator_intIndex += intIncrement;

						}
					}

					{
						if (FilesystemStatIterator_intIndex < FilesystemRead_strFiles.length) {
							functionFilesystemStat();

						} else if (FilesystemStatIterator_intIndex >= FilesystemRead_strFiles.length) {
							functionSuccess();

						}
					}
				};

				var functionFilesystemStat = function() {
					Node.requireFs.stat(__dirname + '/tmp/' + FilesystemRead_strFiles[FilesystemStatIterator_intIndex], function(objectError, objectStat) {
						if (objectError !== null) {
							functionError();

							return;
						}

						if (objectStat.ctime.getTime() < new Date().getTime() - (60 * 60 * 1000)) {
							functionFilesystemDelete();

							return;
						}

						functionFilesystemStatIterator(1);
					});
				};

				var functionFilesystemDelete = function() {
					Node.requireFs.unlink(__dirname + '/tmp/' + FilesystemRead_strFiles[FilesystemStatIterator_intIndex], function(objectError) {
						if (objectError !== null) {
							functionError(objectError);

							return;
						}

						functionFilesystemStatIterator(1);
					});
				};

				var Errorsuccess_intTimestamp = new Date().getTime();

				var functionError = function(objectError) {
					//Node.log([ 'NodeRect - Express', String(new Date().getTime() - Errorsuccess_intTimestamp), 'Error' ]);
		            info("\x1b[31m" + objectError + "\x1b[0m");
				};

				var functionSuccess = function() {
					//Node.log([ 'NodeRect - Express', String(new Date().getTime() - Errorsuccess_intTimestamp), 'Success' ]);
				};

				functionFilesystemRead();
			};

			setInterval(functionInterval, 5 * 60 * 1000);
		}
	}
};

function info(message){
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    console.log("\x1b[1m\x1b[36m" + hour + ":" + min + ":" + sec + "\x1b[37m [INFO] " + message + "\x1b[0m");
}

var Geoip = {
	requireGeoip: null,

	init: function() {
		{
			Geoip.requireGeoip = require('geoip-lite');
		}
	},

	dispel: function() {
		{
			Geoip.requireGeoip = null;
		}
	}
};

var Hypertextmin = {
	requireHtmlmin: null,

	init: function() {
		{
			Hypertextmin.requireHtmlmin = require('html-minifier');
		}
	},

	dispel: function() {
		{
			Hypertextmin.requireHtmlmin = null;
		}
	}
};

var Mime = {
	requireMime: null,

	init: function() {
		{
			Mime.requireMime = require('mime');
		}
	},

	dispel: function() {
		{
			Mime.requireMime = null;
		}
	}
};

var Multer = {
	requireMulter: null,

	init: function() {
		{
			Multer.requireMulter = require('multer')({
				'dest': __dirname + '/tmp',
				'limits': {
					'fieldNameSize': 64,
					'fileSize': 10 * 1024 * 1024,
					'files': 1
				}
			});
		}
	},

	dispel: function() {
		{
			Multer.requireMulter = null;
		}
	}
};

var Mustache = {
	requireMustache: null,

	init: function() {
		{
			Mustache.requireMustache = require('mustache');
		}
	},

	dispel: function() {
		{
			Mustache.requireMustache = null;
		}
	}
};

var Phantom = {
	requirePhantom: null,

	init: function() {
		{
			// sudo apt-get install fontconfig
		}

		{
			Phantom.requirePhantom = require('phantomjs-prebuilt');
		}
	},

	dispel: function() {
		{
			Phantom.requirePhantom = null;
		}
	}
};

var Postgres = {
	requirePg: null,

	objectClient: null,

	init: function() {
		{
			Postgres.requirePg = require('pg');

			Postgres.requirePg.defaults.parseInt8 = true;
		}

		{
			Postgres.requirePg.connect(NodeConf.strPostgresServer, function(objectError, objectClient, functionDone) {
				{
					Postgres.objectClient = objectClient;
				}

				{
					Postgres.objectClient.functionQuery = Postgres.objectClient.query;

					Postgres.objectClient.query = function(objectConfig, functionCallback) {
						Postgres.objectClient.functionQuery(objectConfig, function(objectError, objectResult) {
							{
								if (objectError !== null) {
									if (objectConfig.log === true) {
										console.log('');
										console.dir(objectConfig);
										console.dir(objectError);
										console.log('');
									}
								}
							}

							{
								functionCallback(objectError, objectResult);
							}
						});
					}
				}
			});
		}
	},

	dispel: function() {
		{
			Postgres.requirePg = null;
		}

		{
			Postgres.objectClient = null;
		}
	}
};

var Recaptcha = {
	init: function() {

	},

	dispel: function() {

	},

	verify: function(objectArguments, functionCallback) {
		var Request_strData = '';

		var functionRequest = function() {
			var objectClientrequest = Node.requireHttps.request({
				'host': 'www.google.com',
				'port': 443,
				'path': '/recaptcha/api/siteverify?secret=' + encodeURIComponent(NodeConf.strRecaptchaPrivate) + '&response=' + encodeURIComponent(objectArguments.strResponse) + '&remoteip=' + encodeURIComponent(objectArguments.strIp),
				'method': 'GET'
			}, function(objectClientresponse) {
				objectClientresponse.setEncoding('UTF-8');

				objectClientresponse.on('data', function(strData) {
					Request_strData += strData;
				});

				objectClientresponse.on('end', function() {
					functionParse();
				});
			});

			objectClientrequest.on('error', function(objectError) {
				functionCallback(null);
			});

			objectClientrequest.setTimeout(3 * 1000, function() {
				objectClientrequest.abort();
			});

			objectClientrequest.end();
		};

		var functionParse = function() {
			var objectData = JSON.parse(Request_strData);

			if (objectData.success === undefined) {
				functionCallback(null);

				return;

			} else if (objectData.success === false) {
				functionCallback(null);

				return;

			}

			functionCallback({});
		};

		functionRequest();
	}
};

var Socket = {
	requireSocket: null,

	objectServer: null,

	init: function() {
		{
			Socket.requireSocket = require('socket.io');
		}

		{
			Socket.objectServer = Socket.requireSocket();
		}
	},

	dispel: function() {
		{
			Socket.requireSocket = null;
		}

		{
			Socket.objectServer = null;
		}
	},

	run: function() {
		{
			Socket.objectServer.attach(Express.objectHttp);

			Socket.objectServer.origins('*:*');
		}
	}
};

var Xml = {
	requireXmldoc: null,

	requireSax: null,

	init: function() {
		{
			Xml.requireXmldoc = require('xmldoc');
		}

		{
			Xml.requireSax = require('sax');
		}
	},

	dispel: function() {
		{
			Xml.requireXmldoc = null;
		}

		{
			Xml.requireSax = null;
		}
	}
};

module.exports = function() {
	{
		Node.init();
	}

	{
		if (NodeConf.boolAws === true) {
			Aws.init();
		}

		if (NodeConf.boolExpress === true) {
			Express.init();
		}

		if (NodeConf.boolGeoip === true) {
			Geoip.init();
		}

		if (NodeConf.boolHypertextmin === true) {
			Hypertextmin.init();
		}

		if (NodeConf.boolMime === true) {
			Mime.init();
		}

		if (NodeConf.boolMulter === true) {
			Multer.init();
		}

		if (NodeConf.boolMustache === true) {
			Mustache.init();
		}

		if (NodeConf.boolPhantom === true) {
			Phantom.init();
		}

		if (NodeConf.boolPostgres === true) {
			Postgres.init();
		}

		if (NodeConf.boolRecaptcha === true) {
			Recaptcha.init();
		}

		if (NodeConf.boolSocket === true) {
			Socket.init();
		}

		if (NodeConf.boolXml === true) {
			Xml.init();
		}
	}

	{
		if (NodeConf.boolExpress === true) {
			Express.run();
		}

		if (NodeConf.boolSocket === true) {
			Socket.run();
		}
	}

	return {
		'Node': Node,
		'Aws': Aws,
		'Express': Express,
		'Geoip': Geoip,
		'Hypertextmin': Hypertextmin,
		'Mime': Mime,
		'Multer': Multer,
		'Mustache': Mustache,
		'Phantom': Phantom,
		'Postgres': Postgres,
		'Recaptcha': Recaptcha,
		'Socket': Socket,
		'Xml': Xml
	};
};
