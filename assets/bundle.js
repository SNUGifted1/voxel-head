(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (Buffer,__dirname){
'use strict';

var NodeConf = require(__dirname + '/NodeConf.js')();
var NodeRect = require(__dirname + '/NodeRect.js')();

var Node = NodeRect.Node;
var Aws = NodeRect.Aws;
var Express = NodeRect.Express;
var Geoip = NodeRect.Geoip;
var Hypertextmin = NodeRect.Hypertextmin;
var Mime = NodeRect.Mime;
var Multer = NodeRect.Multer;
var Mustache = NodeRect.Mustache;
var Phantom = NodeRect.Phantom;
var Postgres = NodeRect.Postgres;
var Recaptcha = NodeRect.Recaptcha;
var Socket = NodeRect.Socket;
var Xml = NodeRect.Xml;

var VoxConf = require(__dirname + '/VoxConf.js')();

{
	Express.objectServer.use(function(objectRequest, objectResponse, functionNext) {
		var strName = '';
		var strPassword = '';
		
		{
			var strAuthorization = objectRequest.get('Authorization');
			
			if (strAuthorization !== undefined) {
				var strEncoded = strAuthorization.split(' ');
				
				if (strEncoded.length === 2) {
					var strDecoded = new Buffer(strEncoded[1], 'base64').toString().split(':');
					
					if (strDecoded.length === 2) {
						strName = strDecoded[0];
						strPassword = strDecoded[1];
					}
				}
			}
		}
		
		{
			if (VoxConf.strLoginPassword === '') {
				functionNext();
				
				return;
				
			} else if (VoxConf.strLoginPassword === strPassword) {
				functionNext();
				
				return;
				
			}
		}
		
		{
			objectResponse.status(401);
			
			objectResponse.set({
				'WWW-Authenticate': 'Basic realm="' + VoxConf.strName + '"'
			});
			
			objectResponse.end();
		}
	});
	
	Express.objectServer.use(function(objectRequest, objectResponse, functionNext) {
		objectResponse.header('Access-Control-Allow-Origin', '*');
		
		functionNext();
	});
	
	Express.objectServer.get('/', function(objectRequest, objectResponse) {
		objectResponse.status(302);
		
		objectResponse.set({
			'Location': '/index.html'
		});
		
		objectResponse.end();
	});
	
	Express.objectServer.get('/index.html', function(objectRequest, objectResponse) {
		var Mustache_objectView = {
			'objectMain': {
				'strRandom': Node.hashbase(Node.requireCrypto.randomBytes(64)).substr(0, 32)
			},
			'objectGameserver': {
				'intLoginPassword': Gameserver.intLoginPassword,
				'strLoginMotd': Gameserver.strLoginMotd
			}
		};
		
		var functionPreprocess = function() {
			{
				// ...
			}
			
			functionFilesystemRead();
		};
		
		var FilesystemRead_objectBuffer = null;
		
		var functionFilesystemRead = function() {
			Node.requireFs.readFile(__dirname + '/assets/index.html', function(objectError, objectBuffer) {
				if (objectError !== null) {
					functionError();
					
					return;
				}
				
				{
					FilesystemRead_objectBuffer = objectBuffer;
				}
				
				functionSuccess();
			});
		};
		
		var functionError = function() {
			objectResponse.end();
		};
		
		var functionSuccess = function() {
			var strData = FilesystemRead_objectBuffer.toString();
			
			{
				strData = Mustache.requireMustache.render(strData, Mustache_objectView);
				
				strData = Mustache.requireMustache.render(strData, Mustache_objectView);
			}
			
			{
				strData = Hypertextmin.requireHtmlmin.minify(strData, {
					'collapseWhitespace': true,
					'conservativeCollapse': true,
					'minifyCSS': true,
					'minifyJS': true,
					'removeComments': true
				});
			}
			
			objectResponse.status(200);
			
			objectResponse.set({
				'Content-Length': Buffer.byteLength(strData, 'utf-8'),
				'Content-Type': Mime.requireMime.lookup('html'),
				'Content-Disposition': 'inline; filename="' + objectRequest.path.substr(objectRequest.path.lastIndexOf('/') + 1) + '";'
			});
			
			objectResponse.write(new Buffer(strData, 'utf-8'));
			
			objectResponse.end();
		};
		
		functionPreprocess();
	});
	
	Express.objectServer.use('/', Express.requireExpress.static(__dirname + '/assets', {
		'etag': false,
		'lastModified': false
	}));
}

{
	Socket.objectServer.on('connection', function(objectSocket) {
		{
			objectSocket.strIdent = objectSocket.id;
		}
		
		{
			var strIdent = objectSocket.strIdent;
			
			Player.objectPlayer[strIdent] = {
				'strIdent': strIdent,
				'strTeam': '',
				'strEntity': '',
				'strName': '',
				'intScore': 0,
				'intKills': 0,
				'intDeaths': 0,
				'intHealth': 0,
				'dblPosition': [ 0.0, 0.0, 0.0 ],
				'dblVerlet': [ 0.0, 0.0, 0.0 ],
				'dblAcceleration': [ 0.0, 0.0, 0.0 ],
				'dblRotation': [ 0.0, 0.0, 0.0 ],
				'intJumpcount': 0,
				'intWalk': 0,
				'intWeapon': 0
			};
		}
		
		{
			Player.objectPlayer[objectSocket.strIdent].objectSocket = objectSocket;
		}
		
		{
			objectSocket.emit('eventWorld', {
				'strBuffer': World.saveBuffer(null)
			});
		}
		
		{
			objectSocket.emit('eventLogin', {
				'strType': 'typeReject',
				'strMessage': ''
			});
		}
		
		{
			objectSocket.on('eventLogin', function(objectData) {
				if (objectData.strName === undefined) {
					return;
					
				} else if (objectData.strTeam === undefined) {
					return;
					
				}
				
				if (Player.objectPlayer[objectSocket.strIdent] === undefined) {
					return;
					
				} else if (objectData.strTeam.replace(new RegExp('(teamRed)|(teamBlue)', ''), '') !== '') {
					return;
					
				}
				
				{
					if (Gameserver.intPlayerActive === Gameserver.intPlayerCapacity) {
						objectSocket.emit('eventLogin', {
							'strType': 'typeReject',
							'strMessage': 'server full'
						});
						
						return;
						
					} else if (objectData.strName === '') {
						objectSocket.emit('eventLogin', {
							'strType': 'typeReject',
							'strMessage': 'name invalid'
						});
						
						return;
						
					}
				}
				
				{
					if (objectData.strName.length > 20) {
						objectData.strName = objectData.strName.substr(1, 20) + ' ... ';
					}
				}
				
				{
					Player.objectPlayer[objectSocket.strIdent].strTeam = objectData.strTeam;
					
					Player.objectPlayer[objectSocket.strIdent].strName = objectData.strName;
				}
				
				{
					objectSocket.emit('eventLogin', {
						'strType': 'typeAccept',
						'strMessage': ''
					});
				}
				
				{
					Gameserver.playerRespawn(Player.objectPlayer[objectSocket.strIdent]);
				}
			});
			
			objectSocket.on('eventPing', function(objectData) {
				if (objectData.intTimestamp === undefined) {
					return;
				}
				
				if (Player.objectPlayer[objectSocket.strIdent] === undefined) {
					return;
				}
				
				{
					objectSocket.emit('eventPing', {
						'strPhaseActive': Gameserver.strPhaseActive,
						'intPhaseRound': Gameserver.intPhaseRound,
						'intPhaseRemaining': Gameserver.intPhaseRemaining,
						'strWorldAvailable': Gameserver.strWorldAvailable,
						'strWorldActive': Gameserver.strWorldActive,
						'intPlayerActive': Gameserver.intPlayerActive,
						'intPlayerCapacity': Gameserver.intPlayerCapacity,
						'intScoreRed': Gameserver.intScoreRed,
						'intScoreBlue': Gameserver.intScoreBlue
					});
				}
			});
			
			objectSocket.on('eventChat', function(objectData) {
				if (objectData.strMessage === undefined) {
					return;
				}
				
				if (Player.objectPlayer[objectSocket.strIdent] === undefined) {
					return;
					
				} else if (objectData.strMessage === '') {
					return;
					
				}
				
				{
					if (objectData.strMessage.length > 140) {
						objectData.strMessage = objectData.strMessage.substr(1, 140) + ' ... ';
					}
				}
				
				{
					Socket.objectServer.emit('eventChat', {
						'strName': Player.objectPlayer[objectSocket.strIdent].strName,
						'strMessage': objectData.strMessage
					});
				}
			});
			
			objectSocket.on('eventWorldCreate', function(objectData) {
				if (objectData.intCoordinate === undefined) {
					return;
					
				} else if (objectData.intCoordinate.length !== 3) {
					return;
					
				} else if (objectData.strType === undefined) {
					return;
					
				} else if (objectData.boolBlocked === undefined) {
					return;
					
				}
				
				if (Player.objectPlayer[objectSocket.strIdent] === undefined) {
					return;
					
				} else if (Player.objectPlayer[objectSocket.strIdent].intWeapon > 0) {
					return;
					
				} else if (World.updateBlocked(objectData.intCoordinate) === true) {
					return;
					
				}
				
				{
					Player.objectPlayer[objectSocket.strIdent].intWeapon = Constants.intInteractionPickaxeDuration;
				}
				
				{
					var dblPosition = [ 0.0, 0.0, 0.0 ];
					var dblSize = [ 0.0, 0.0, 0.0 ];
					
					{
						dblPosition[0] = objectData.intCoordinate[0] + (0.5 * Constants.dblGameBlocksize);
						dblPosition[1] = objectData.intCoordinate[1] + (0.5 * Constants.dblGameBlocksize);
						dblPosition[2] = objectData.intCoordinate[2] + (0.5 * Constants.dblGameBlocksize);
						
						dblSize[0] = 1.25 * Constants.dblGameBlocksize;
						dblSize[1] = 1.25 * Constants.dblGameBlocksize;
						dblSize[2] = 1.25 * Constants.dblGameBlocksize;
					}
					
					Physics.updateObjectcol({
						'dblPosition': dblPosition,
						'dblSize': dblSize
					}, function(functionObjectcol) {
						var objectPlayer = null;
						
						{
							if (functionObjectcol.strIdent === undefined) {
								functionObjectcol.strIdent = Object.keys(Player.objectPlayer);
							}
						}
						
						{
							do {
								objectPlayer = Player.objectPlayer[functionObjectcol.strIdent.pop()];
								
								if (objectPlayer === undefined) {
									return null;
								}
								
								break;
							} while (true);
						}
						
						{
							objectPlayer.dblSize = Constants.dblPlayerHitbox;
						}
						
						return objectPlayer;
					}, function(objectPlayer) {
						{
							objectData.strType = '';
							
							objectData.boolBlocked = true;
						}
					});
				}
				
				if (objectData.strType !== 'voxelDirt') {
					return;
					
				} else if (objectData.boolBlocked !== false) {
					return;
					
				}
				
				{
					World.updateCreate(objectData.intCoordinate, objectData.strType, objectData.boolBlocked);
				}
				
				{
					Socket.objectServer.emit('eventWorldCreate', {
						'intCoordinate': objectData.intCoordinate,
						'strType': objectData.strType,
						'boolBlocked': objectData.boolBlocked
					});
				}
			});
			
			objectSocket.on('eventWorldDestroy', function(objectData) {
				if (objectData.intCoordinate === undefined) {
					return;
					
				} else if (objectData.intCoordinate.length !== 3) {
					return;
					
				}
				
				if (Player.objectPlayer[objectSocket.strIdent] === undefined) {
					return;
					
				} else if (Player.objectPlayer[objectSocket.strIdent].intWeapon > 0) {
					return;
					
				} else if (World.updateBlocked(objectData.intCoordinate) === true) {
					return;
					
				}
				
				{
					Player.objectPlayer[objectSocket.strIdent].intWeapon = Constants.intInteractionPickaxeDuration;
				}
				
				{
					World.updateDestroy(objectData.intCoordinate);
				}
				
				{
					Socket.objectServer.emit('eventWorldDestroy', {
						'intCoordinate': objectData.intCoordinate
					});
				}
			});
			
			objectSocket.on('eventPlayer', function(objectData) {
				if (Player.objectPlayer[objectSocket.strIdent] === undefined) {
					return;
				}

				{
					var objectOverwrite = {};
					
					try {
						Player.loadBuffer(objectOverwrite, objectData.strBuffer);
					} catch (objectError) {
						objectOverwrite = {};
					}

					{
						if (objectOverwrite['1'] !== undefined) {
							Player.objectPlayer[objectSocket.strIdent].dblPosition = objectOverwrite['1'].dblPosition;
							Player.objectPlayer[objectSocket.strIdent].dblVerlet = objectOverwrite['1'].dblVerlet;
							Player.objectPlayer[objectSocket.strIdent].dblAcceleration = objectOverwrite['1'].dblAcceleration;
							Player.objectPlayer[objectSocket.strIdent].dblRotation = objectOverwrite['1'].dblRotation;
						}
					}
				}
			});
			
			objectSocket.on('eventPlayerEntity', function(objectData) {
				if (objectData.strEntity === undefined) {
					return;
				}
				
				if (Player.objectPlayer[objectSocket.strIdent] === undefined) {
					return;
					
				} else if (objectData.strEntity.replace(new RegExp('(entityPickaxe)|(entitySword)|(entityBow)', ''), '') !== '') {
					return;
					
				}
				
				{
					Player.objectPlayer[objectSocket.strIdent].strEntity = objectData.strEntity;
				}
			});
			
			objectSocket.on('eventPlayerWeapon', function(objectData) {
				if (objectData.strWeapon === undefined) {
					return;
				}
				
				if (Player.objectPlayer[objectSocket.strIdent] === undefined) {
					return;
					
				} else if (Player.objectPlayer[objectSocket.strIdent].intWeapon > 0) {
					return;
					
				}
				
				{
					if (objectData.strWeapon === 'weaponSword') {
						Player.objectPlayer[objectSocket.strIdent].intWeapon = Constants.intInteractionSwordDuration;
						
					} else if (objectData.strWeapon === 'weaponBow') {
						Player.objectPlayer[objectSocket.strIdent].intWeapon = Constants.intInteractionBowDuration;
						
					}
				}
				
				{
					if (objectData.strWeapon === 'weaponSword') {
						var strIdent = 'itemSword' + ' - ' + Node.hashbase(Node.requireCrypto.randomBytes(16)).substr(0, 8);
						var strPlayer = Player.objectPlayer[objectSocket.strIdent].strIdent;
						var dblPosition = [ 0.0, 0.0, 0.0 ];
						var dblVerlet = [ 0.0, 0.0, 0.0 ];
						var dblAcceleration = [ 0.0, 0.0, 0.0 ];
						var dblRotation = [ 0.0, 0.0, 0.0 ];
						
						{
							dblPosition[0] = Player.objectPlayer[objectSocket.strIdent].dblPosition[0];
							dblPosition[1] = Player.objectPlayer[objectSocket.strIdent].dblPosition[1] + (0.25 * Constants.dblPlayerSize[1]);
							dblPosition[2] = Player.objectPlayer[objectSocket.strIdent].dblPosition[2];
							
							dblVerlet[0] = dblPosition[0];
							dblVerlet[1] = dblPosition[1];
							dblVerlet[2] = dblPosition[2];
							
							dblAcceleration[0] = -1.0 * Math.sin(Player.objectPlayer[objectSocket.strIdent].dblRotation[1]) * Math.cos(Player.objectPlayer[objectSocket.strIdent].dblRotation[2]);
							dblAcceleration[1] = -1.0 * Math.sin(Player.objectPlayer[objectSocket.strIdent].dblRotation[2] + (1.0 * Math.PI));
							dblAcceleration[2] = -1.0 * Math.cos(Player.objectPlayer[objectSocket.strIdent].dblRotation[1]) * Math.cos(Player.objectPlayer[objectSocket.strIdent].dblRotation[2]);
							
							dblRotation[0] = Player.objectPlayer[objectSocket.strIdent].dblRotation[0];
							dblRotation[1] = Player.objectPlayer[objectSocket.strIdent].dblRotation[1];
							dblRotation[2] = Player.objectPlayer[objectSocket.strIdent].dblRotation[2];
						}
						
						var objectItem = {
							'strIdent': strIdent,
							'strPlayer': strPlayer,
							'dblPosition': dblPosition,
							'dblVerlet': dblVerlet,
							'dblAcceleration': dblAcceleration,
							'dblRotation': dblRotation
						};
						
						{
							objectItem.dblSize = [ 0.0, 0.0, 0.0 ];
							
							Physics.updateRaycol(objectItem, function(functionRaycol) {
								var objectPlayer = null;
								
								{
									if (functionRaycol.strIdent === undefined) {
										functionRaycol.strIdent = Object.keys(Player.objectPlayer);
									}
								}
								
								{
									do {
										objectPlayer = Player.objectPlayer[functionRaycol.strIdent.pop()];
										
										if (objectPlayer === undefined) {
											return null;
										}
										
										if (objectPlayer.strIdent === objectItem.strPlayer) {
											continue;
										}
										
										var dblDistanceX = objectPlayer.dblPosition[0] - objectItem.dblPosition[0];
										var dblDistanceY = objectPlayer.dblPosition[1] - objectItem.dblPosition[1];
										var dblDistanceZ = objectPlayer.dblPosition[2] - objectItem.dblPosition[2];
										
										if (Math.sqrt((dblDistanceX * dblDistanceX) + (dblDistanceY * dblDistanceY) + (dblDistanceZ * dblDistanceZ)) > Constants.dblInteractionSwordRange) {
											continue;
										}
										
										break;
									} while (true);
								}
								
								{
									objectPlayer.dblSize = Constants.dblPlayerHitbox;
								}
								
								return objectPlayer;
							}, function(objectPlayer) {
								{
									Gameserver.playerHit(objectPlayer, objectItem);
								}
							});
						}
						
					} else if (objectData.strWeapon === 'weaponBow') {
						var strIdent = 'itemArrow' + ' - ' + Node.hashbase(Node.requireCrypto.randomBytes(16)).substr(0, 8);
						var strPlayer = Player.objectPlayer[objectSocket.strIdent].strIdent;
						var dblPosition = [ 0.0, 0.0, 0.0 ];
						var dblVerlet = [ 0.0, 0.0, 0.0 ];
						var dblAcceleration = [ 0.0, 0.0, 0.0 ];
						var dblRotation = [ 0.0, 0.0, 0.0 ];
						
						{
							dblPosition[0] = Player.objectPlayer[objectSocket.strIdent].dblPosition[0] + (0.25 * Math.sin(Player.objectPlayer[objectSocket.strIdent].dblRotation[1] + (0.5 * Math.PI)));
							dblPosition[1] = Player.objectPlayer[objectSocket.strIdent].dblPosition[1] + (0.1);
							dblPosition[2] = Player.objectPlayer[objectSocket.strIdent].dblPosition[2] + (0.25 * Math.cos(Player.objectPlayer[objectSocket.strIdent].dblRotation[1] + (0.5 * Math.PI)));
							
							dblVerlet[0] = dblPosition[0];
							dblVerlet[1] = dblPosition[1];
							dblVerlet[2] = dblPosition[2];
							
							dblAcceleration[0] = -1.0 * Math.sin(Player.objectPlayer[objectSocket.strIdent].dblRotation[1]) * Math.cos(Player.objectPlayer[objectSocket.strIdent].dblRotation[2]);
							dblAcceleration[1] = -1.0 * Math.sin(Player.objectPlayer[objectSocket.strIdent].dblRotation[2] + (1.0 * Math.PI));
							dblAcceleration[2] = -1.0 * Math.cos(Player.objectPlayer[objectSocket.strIdent].dblRotation[1]) * Math.cos(Player.objectPlayer[objectSocket.strIdent].dblRotation[2]);
							
							dblRotation[0] = Player.objectPlayer[objectSocket.strIdent].dblRotation[0];
							dblRotation[1] = Player.objectPlayer[objectSocket.strIdent].dblRotation[1];
							dblRotation[2] = Player.objectPlayer[objectSocket.strIdent].dblRotation[2];
						}
						
						Item.objectItem[strIdent] = {
							'strIdent': strIdent,
							'strPlayer': strPlayer,
							'dblPosition': dblPosition,
							'dblVerlet': dblVerlet,
							'dblAcceleration': dblAcceleration,
							'dblRotation': dblRotation
						};
						
					}
				}
			});
			
			objectSocket.on('disconnect', function() {
				{
					delete Player.objectPlayer[objectSocket.strIdent];
				}
			});
		}
	});
}

var Constants = {
	intGameLoop: 16,
	dblGameScale: 0.04,
	dblGameBlocksize: 1.0,
	
	intPlayerHealth: 100,
	dblPlayerMovement: [ 0.03, 0.18, 0.03 ],
	dblPlayerSize: [ 0.9, 1.6, 0.9 ],
	dblPlayerGravity: [ 0.0, -0.01, 0.0 ],
	dblPlayerMaxvel: [ 0.08, 0.26, 0.08 ],
	dblPlayerFriction: [ 0.8, 1.0, 0.8 ],
	dblPlayerHitbox: [ 0.4, 0.9, 0.4 ],
	
	intInteractionPickaxeDuration: 30,
	intInteractionSwordDuration: 30,
	intInteractionSwordDamage: 20,
	dblInteractionSwordImpact: [ 0.11, 0.11, 0.11 ],
	dblInteractionSwordRange: 2.0,
	intInteractionBowDuration: 30,
	intInteractionBowDamage: 20,
	dblInteractionBowImpact: [ 0.11, 0.11, 0.11 ],
	
	dblFlagSize: [ 1.0, 1.0, 1.0 ],
	dblFlagGravity: [ 0.0, -0.01, 0.0 ],
	dblFlagMaxvel: [ 0.08, 0.26, 0.08 ],
	dblFlagFriction: [ 0.8, 1.0, 0.8 ],
	dblFlagRotate: 0.02,
	
	dblArrowSize: [ 0.3, 0.3, 0.3 ],
	dblArrowGravity: [ 0.0, -0.001, 0.0 ],
	dblArrowMaxvel: [ 0.36 ],
	dblArrowFriction: [ 1.0, 1.0, 1.0 ]
};

var Physics = require(__dirname + '/assets/libPhysics.js');

{
	var objectBrowserify = {
		'Constants': Constants,
		'Voxel': null,
		'Physics': Physics,
		'Input': null
	};

	Physics.browserify(objectBrowserify);
}

var World = require(__dirname + '/assets/libWorld.js');
var Player = require(__dirname + '/assets/libPlayer.js');
var Item = require(__dirname + '/assets/libItem.js');

{
	var objectBrowserify = {
		'Constants': Constants,
		'Voxel': null,
		'Physics': Physics,
		'Input': null,
		'World': World,
		'Player': Player,
		'Item': Item
	};

	World.browserify(objectBrowserify);
	Player.browserify(objectBrowserify);
	Item.browserify(objectBrowserify);
}

var Gameserver = {
	strName: '',
	
	strLoginPassword: '',
	intLoginPassword: 0,
	strLoginMotd: '',
	
	strPhaseActive: '',
	intPhaseRound: 0,
	intPhaseRemaining: 0,
	
	strWorldAvailable: [],
	strWorldActive: '',
	strWorldFingerprint: '',
	
	intPlayerActive: 0,
	intPlayerCapacity: 0,
	
	intScoreRed: 0,
	intScoreBlue: 0,
	
	init: function() {
		{
			Gameserver.strName = VoxConf.strName;
		}
		
		{
			Gameserver.strLoginPassword = VoxConf.strLoginPassword;
			
			Gameserver.intLoginPassword = VoxConf.strLoginPassword === '' ? 0 : 1;
			
			Gameserver.strLoginMotd = VoxConf.strLoginMotd;
		}
		
		{
			Gameserver.strPhaseActive = 'Build';
			
			Gameserver.intPhaseRound = VoxConf.intPhaseRound;
			
			Gameserver.intPhaseRemaining = VoxConf.intPhaseRemaining;
		}
		
		{
			Gameserver.strWorldAvailable = VoxConf.strWorldAvailable;
			
			Gameserver.strWorldActive = Gameserver.strWorldAvailable[(Gameserver.strWorldAvailable.indexOf(Gameserver.strWorldActive) + 1) % Gameserver.strWorldAvailable.length];
			
			Gameserver.strWorldFingerprint = '';
		}
		
		{
			Gameserver.intPlayerCapacity = VoxConf.intPlayerCapacity;
			
			Gameserver.intPlayerActive = 0;
		}
		
		{
			Gameserver.intScoreRed = 0;
			
			Gameserver.intScoreBlue = 0;
		}
	},
	
	dispel: function() {
		{
			Gameserver.strName = '';
		}
		
		{
			Gameserver.strLoginPassword = '';
			
			Gameserver.intLoginPassword = 0;
			
			Gameserver.strLoginMotd = '';
		}
		
		{
			Gameserver.strPhaseActive = '';
			
			Gameserver.intPhaseRound = 0;
			
			Gameserver.intPhaseRemaining = 0;
		}
		
		{
			Gameserver.strWorldAvailable = [];
			
			Gameserver.strWorldActive = '';
			
			Gameserver.strWorldFingerprint = '';
		}
		
		{
			Gameserver.intPlayerCapacity = 0;
			
			Gameserver.intPlayerActive = 0;
		}
		
		{
			Gameserver.intScoreRed = 0;
			
			Gameserver.intScoreBlue = 0;
		}
	},
	
	phaseUpdate: function() {
		{
			Gameserver.intPhaseRemaining = Math.max(0, Gameserver.intPhaseRemaining - Constants.intGameLoop);
		}
		
		{
			if (Gameserver.intPhaseRemaining === 0) {
				{
					if (Gameserver.strPhaseActive === 'Build') {
						{
							Gameserver.strPhaseActive = 'Combat';
							
							Gameserver.intPhaseRound -= 0;
							
							Gameserver.intPhaseRemaining = VoxConf.intPhaseRemaining;
						}
						
					} else if (Gameserver.strPhaseActive === 'Combat') {
						{
							Gameserver.strPhaseActive = 'Build';
							
							Gameserver.intPhaseRound -= 1;
							
							Gameserver.intPhaseRemaining = VoxConf.intPhaseRemaining;
						}
						
					}
				}
				
				{
					if (Gameserver.intPhaseRound === 0) {
						{
							Gameserver.strPhaseActive = 'Build';
							
							Gameserver.intPhaseRound = VoxConf.intPhaseRound;
							
							Gameserver.intPhaseRemaining = VoxConf.intPhaseRemaining;
						}
						
						{
							Gameserver.strWorldActive = Gameserver.strWorldAvailable[(Gameserver.strWorldAvailable.indexOf(Gameserver.strWorldActive) + 1) % Gameserver.strWorldAvailable.length];
							
							Gameserver.strWorldFingerprint = '';
						}
						
						{
							Gameserver.intScoreRed = 0;
							
							Gameserver.intScoreBlue = 0;
						}
					}
				}
			}
		}
	},
	
	worldUpdate: function() {
		{
			var boolGood = true;
			
			if (Gameserver.strWorldFingerprint.indexOf(Gameserver.strWorldActive) !== 0) {
				{
					boolGood = false;
				}
				
				{
					World.loadBuffer(null, Node.requireFs.readFileSync(__dirname + '/worlds/' + Gameserver.strWorldActive + '.txt').toString());
				}
				
				{
					for (var intFor1 = 0; intFor1 < World.intFlagRed.length; intFor1 += 1) {
						var intCoordinate = World.intFlagRed[intFor1];
						
						{
							World.updateDestroy(intCoordinate);
						}
					}
					
					for (var intFor1 = 0; intFor1 < World.intFlagBlue.length; intFor1 += 1) {
						var intCoordinate = World.intFlagBlue[intFor1];
						
						{
							World.updateDestroy(intCoordinate);
						}
					}
				}
				
			} else if (Gameserver.strWorldFingerprint.indexOf(Gameserver.strWorldActive + ' - ' + Gameserver.strPhaseActive) !== 0) {
				{
					boolGood = false;
				}
				
				{
					if (Gameserver.strPhaseActive === 'Build') {
						for (var intFor1 = 0; intFor1 < World.intSeparator.length; intFor1 += 1) {
							var intCoordinate = World.intSeparator[intFor1];
							
							{
								World.updateCreate(intCoordinate, 'voxelSeparator', true);
							}
						}
						
					} else if (Gameserver.strPhaseActive === 'Combat') {
						for (var intFor1 = 0; intFor1 < World.intSeparator.length; intFor1 += 1) {
							var intCoordinate = World.intSeparator[intFor1];
							
							{
								World.updateDestroy(intCoordinate);
							}
						}
						
					}
				}
				
			}
			
			if (boolGood === false) {
				{
					Gameserver.strWorldFingerprint = Gameserver.strWorldActive + ' - ' + Gameserver.strPhaseActive + ' - ' + Gameserver.intPhaseRound;
				}
				
				{
					Item.initFlag(Item.objectItem['itemFlag - teamRed']);
					
					Item.initFlag(Item.objectItem['itemFlag - teamBlue']);
				}
				
				{
					Socket.objectServer.emit('eventWorld', {
						'strBuffer': World.saveBuffer(null)
					});
				}
				
				{
					for (var strIdent in Player.objectPlayer) {
						var objectPlayer = Player.objectPlayer[strIdent];
						
						if (objectPlayer.strTeam === '') {
							continue;
						}
						
						{
							Gameserver.playerRespawn(objectPlayer);
						}
					}
				}
			}
		}
	},
	
	playerUpdate: function() {
		{
			Gameserver.intPlayerActive = Object.keys(Player.objectPlayer).length;
		}
		
		{
			for (var strIdent in Player.objectPlayer) {
				var objectPlayer = Player.objectPlayer[strIdent];
				
				if (objectPlayer.strTeam === '') {
					continue;
				}
				
				{
					if (objectPlayer.intHealth < 1) {
						{
							objectPlayer.intDeaths += 1;
						}
						
						{
							Gameserver.playerRespawn(objectPlayer);
						}
						
					} else if (objectPlayer.dblPosition[1] < (2.0 * Constants.dblGameBlocksize)) {
						{
							objectPlayer.intDeaths += 1;
						}
						
						{
							Gameserver.playerRespawn(objectPlayer);
						}
						
					}
				}
			}
		}
	},
	
	playerRespawn: function(objectPlayer) {
		{
			objectPlayer.strEntity = '';
		}
		
		{
			objectPlayer.intHealth = Constants.intPlayerHealth;
		}
		
		{
			var intSpawn = [];
			
			if (objectPlayer.strTeam === 'teamRed') {
				intSpawn = World.intSpawnRed[Math.floor(Math.random() * World.intSpawnRed.length)];
				
			} else if (objectPlayer.strTeam === 'teamBlue') {
				intSpawn = World.intSpawnBlue[Math.floor(Math.random() * World.intSpawnBlue.length)];
				
			}
			
			objectPlayer.dblPosition[0] = intSpawn[0] + 0.5;
			objectPlayer.dblPosition[1] = intSpawn[1] + 2.0;
			objectPlayer.dblPosition[2] = intSpawn[2] + 0.5;
			
			objectPlayer.dblVerlet[0] = objectPlayer.dblPosition[0];
			objectPlayer.dblVerlet[1] = objectPlayer.dblPosition[1];
			objectPlayer.dblVerlet[2] = objectPlayer.dblPosition[2];
		}
		
		{
			objectPlayer.objectSocket.emit('eventPlayerRespawn', {
				'dblPosition': objectPlayer.dblPosition,
				'dblVerlet': objectPlayer.dblVerlet
			});
		}
		
		{
			if (Item.objectItem['itemFlag - teamRed'].strPlayer === objectPlayer.strIdent) {
				{
					Item.objectItem['itemFlag - teamRed'].strPlayer = 'playerDropped';
				}
				
			} else if (Item.objectItem['itemFlag - teamBlue'].strPlayer === objectPlayer.strIdent) {
				{
					Item.objectItem['itemFlag - teamBlue'].strPlayer = 'playerDropped';
				}
				
			}
		}
	},
	
	playerHit: function(objectPlayer, objectItem) {
		{
			if (objectItem.strIdent.indexOf('itemSword') === 0) {
				objectPlayer.intHealth -= Constants.intInteractionSwordDamage;
				
			} else if (objectItem.strIdent.indexOf('itemArrow') === 0) {
				objectPlayer.intHealth -= Constants.intInteractionBowDamage;
				
			}
		}
		
		{
			if (objectItem.strIdent.indexOf('itemSword') === 0) {
				objectPlayer.dblAcceleration[0] = -1.0 * Constants.dblInteractionSwordImpact[0] * Math.sin(objectItem.dblRotation[1]) * Math.cos(objectItem.dblRotation[2]);
				objectPlayer.dblAcceleration[1] = -1.0 * Constants.dblInteractionSwordImpact[1] * Math.sin(objectItem.dblRotation[2] + (1.0 * Math.PI));
				objectPlayer.dblAcceleration[2] = -1.0 * Constants.dblInteractionSwordImpact[2] * Math.cos(objectItem.dblRotation[1]) * Math.cos(objectItem.dblRotation[2]);
				
			} else if (objectItem.strIdent.indexOf('itemArrow') === 0) {
				objectPlayer.dblAcceleration[0] = -1.0 * Constants.dblInteractionBowImpact[0] * Math.sin(objectItem.dblRotation[1]) * Math.cos(objectItem.dblRotation[2]);
				objectPlayer.dblAcceleration[1] = -1.0 * Constants.dblInteractionBowImpact[1] * Math.sin(objectItem.dblRotation[2] + (1.0 * Math.PI));
				objectPlayer.dblAcceleration[2] = -1.0 * Constants.dblInteractionBowImpact[2] * Math.cos(objectItem.dblRotation[1]) * Math.cos(objectItem.dblRotation[2]);
				
			}
		}
		
		{
			objectPlayer.objectSocket.emit('eventPlayerHit', {
				'dblAcceleration': objectPlayer.dblAcceleration
			});
		}
		
		{
			if (objectPlayer.intHealth < 1) {
				if (Player.objectPlayer[objectItem.strPlayer] !== undefined) {
					Player.objectPlayer[objectItem.strPlayer].intKills += 1;
				}
			}
		}
	},
	
	itemUpdate: function() {
		{
			for (var strIdent in Item.objectItem) {
				var objectItem = Item.objectItem[strIdent];
				
				{
					if (objectItem.strPlayer !== 'playerInitial') {
						if (objectItem.strPlayer !== 'playerDropped') {
							if (Player.objectPlayer[objectItem.strPlayer] === undefined) {
								objectItem.strPlayer = 'playerDropped';
							}
						}
					}
				}
				
				{
					if (objectItem.strIdent.indexOf('itemFlag') === 0) {
						{
							objectItem.dblSize = Constants.dblFlagSize;
							
							Physics.updateObjectcol(objectItem, function(functionObjectcol) {
								var objectPlayer = null;
								
								{
									if (functionObjectcol.strIdent === undefined) {
										functionObjectcol.strIdent = Object.keys(Player.objectPlayer);
									}
								}
								
								{
									do {
										objectPlayer = Player.objectPlayer[functionObjectcol.strIdent.pop()];
										
										if (objectPlayer === undefined) {
											return null;
										}
										
										if (objectPlayer.strTeam === '') {
											continue;
										}
										
										break;
									} while (true);
								}
								
								{
									objectPlayer.dblSize = Constants.dblPlayerHitbox;
								}
								
								return objectPlayer;
							}, function(objectPlayer) {
								{
									if (objectItem.strPlayer === 'playerInitial') {
										if (objectItem.strIdent.indexOf(objectPlayer.strTeam) === -1) {
											{
												objectItem.strPlayer = objectPlayer.strIdent;
											}
											
										} else if (objectItem.strIdent.indexOf(objectPlayer.strTeam) !== -1) {
											{
												if (Item.objectItem['itemFlag - teamBlue'].strPlayer === objectPlayer.strIdent) {
													{
														Item.initFlag(Item.objectItem['itemFlag - teamBlue']);
													}
													
													{
														Gameserver.intScoreRed += 1;
														
														objectPlayer.intScore += 1;
													}
													
												} else if (Item.objectItem['itemFlag - teamRed'].strPlayer === objectPlayer.strIdent) {
													{
														Item.initFlag(Item.objectItem['itemFlag - teamRed']);
													}
													
													{
														Gameserver.intScoreBlue += 1;
														
														objectPlayer.intScore += 1;
													}
													
												}
											}
											
										}
										
									} else if (objectItem.strPlayer === 'playerDropped') {
										if (objectItem.strIdent.indexOf(objectPlayer.strTeam) === -1) {
											{
												objectItem.strPlayer = objectPlayer.strIdent;
											}
											
										} else if (objectItem.strIdent.indexOf(objectPlayer.strTeam) !== -1) {
											{
												Item.initFlag(objectItem);
											}
											
										}
										
									}
								}
							});
						}
						
					} else if (objectItem.strIdent.indexOf('itemArrow') === 0) {
						{
							objectItem.dblSize = Constants.dblArrowSize;
							
							Physics.updateObjectcol(objectItem, function(functionObjectcol) {
								var objectPlayer = null;
								
								{
									if (functionObjectcol.strIdent === undefined) {
										functionObjectcol.strIdent = Object.keys(Player.objectPlayer);
									}
								}
								
								{
									do {
										objectPlayer = Player.objectPlayer[functionObjectcol.strIdent.pop()];
										
										if (objectPlayer === undefined) {
											return null;
										}
										
										if (objectPlayer.strTeam === '') {
											continue;
											
										} else if (objectPlayer.strIdent === objectItem.strPlayer) {
											continue;
											
										}
										
										break;
									} while (true);
								}
								
								{
									objectPlayer.dblSize = Constants.dblPlayerHitbox;
								}
								
								return objectPlayer;
							}, function(objectPlayer) {
								{
									Gameserver.playerHit(objectPlayer, objectItem);
								}
								
								{
									delete Item.objectItem[objectItem.strIdent];
								}
							});
						}
						
					}
				}
			}
		}
	}
};

{
	Gameserver.init();
}

{
	Physics.init();
	
	Physics.functionWorldcol = function(intCoordinateX, intCoordinateY, intCoordinateZ) {
		if (intCoordinateY === 0) {
			return true;
			
		} else if (World.objectWorld[(intCoordinateX << 20) + (intCoordinateY << 10) + (intCoordinateZ << 0)] !== undefined) {
			return true;
			
		}
		
		return false;
	}
}

{
	World.init();
}

{
	Player.init();
}

{
	Item.init();
	
	Item.functionFlagInit = function(objectItem) {
		{
			objectItem.strPlayer = 'playerInitial';
		}

		{
			var intCoordinate = [ 0, 0, 0 ];
			
			if (objectItem.strIdent.indexOf('teamRed') !== -1) {
				intCoordinate = World.intFlagRed[Math.floor(Math.random() * World.intFlagRed.length)];
				
			} else if (objectItem.strIdent.indexOf('teamBlue') !== -1) {
				intCoordinate = World.intFlagBlue[Math.floor(Math.random() * World.intFlagBlue.length)];
				
			}
			
			objectItem.dblPosition[0] = intCoordinate[0] + 0.5;
			objectItem.dblPosition[1] = intCoordinate[1] + 0.5;
			objectItem.dblPosition[2] = intCoordinate[2] + 0.5;
			
			objectItem.dblVerlet[0] = objectItem.dblPosition[0];
			objectItem.dblVerlet[1] = objectItem.dblPosition[1];
			objectItem.dblVerlet[2] = objectItem.dblPosition[2];
		}
	};
	
	Item.functionFlagPlayer = function(objectItem) {
		{
			if (Player.objectPlayer[objectItem.strPlayer] !== undefined) {
				objectItem.dblPosition[0] = Player.objectPlayer[objectItem.strPlayer].dblPosition[0];
				objectItem.dblPosition[1] = Player.objectPlayer[objectItem.strPlayer].dblPosition[1] + 1.0;
				objectItem.dblPosition[2] = Player.objectPlayer[objectItem.strPlayer].dblPosition[2];
				
				objectItem.dblVerlet[0] = objectItem.dblPosition[0];
				objectItem.dblVerlet[1] = objectItem.dblPosition[1];
				objectItem.dblVerlet[2] = objectItem.dblPosition[2];
			}
		}
	};
}

{
	var Animationframe_intTimestamp = new Date().getTime();
	
	var functionAnimationframe = function() {
		{
			if (Gameserver.intPlayerActive === 0) {
				{
					Gameserver.strPhaseActive = 'Build';
					
					Gameserver.intPhaseRound = VoxConf.intPhaseRound;
					
					Gameserver.intPhaseRemaining = VoxConf.intPhaseRemaining;
				}
				
				{
					Gameserver.strWorldFingerprint = '';
				}
				
				{
					Gameserver.intScoreRed = 0;
					
					Gameserver.intScoreBlue = 0;
				}
				
			} else if (Gameserver.intPlayerActive !== 0) {
				{
					Gameserver.phaseUpdate();
				}
				
				{
					World.update();
					
					Gameserver.worldUpdate();
				}
				
			}
		}
		
		{
			Player.update();
			
			Gameserver.playerUpdate();
		}
		
		{
			Item.update();
			
			Gameserver.itemUpdate();
		}
		
		{
			Socket.objectServer.emit('eventPlayer', {
				'strBuffer': Player.saveBuffer(null)
			});
			
			Socket.objectServer.emit('eventItem', {
				'strBuffer': Item.saveBuffer(null)
			});
		}
		
		{
			var intWait = Constants.intGameLoop - (new Date().getTime() - Animationframe_intTimestamp);
			
			if (intWait >= 1) {
				setTimeout(functionAnimationframe, intWait);
				
			} else if (intWait < 1) {
				setImmediate(functionAnimationframe);
				
			}
		}
		
		{
			Animationframe_intTimestamp = new Date().getTime();
		}
	};
	
	setTimeout(functionAnimationframe, Constants.intGameLoop);
}

{
	var functionInterval = function() {
		var functionAdvertise = function() {
			if (VoxConf.boolAdvertise === true) {
				functionRequest();
				
			} else if (VoxConf.boolAdvertise === true) {
				functionSuccess();
				
			}
		};
		
		var functionRequest = function() {
			var objectClientrequest = Node.requireHttp.request({
				'host': 'www.voxel-warriors.com',
				'port': 80,
				'path': '/host.xml?intPort=' + encodeURIComponent(NodeConf.intExpressPort) + '&strName=' + encodeURIComponent(Gameserver.strName) + '&intLoginPassword=' + encodeURIComponent(Gameserver.intLoginPassword) + '&strWorldActive=' + encodeURIComponent(Gameserver.strWorldActive) + '&intPlayerCapacity=' + encodeURIComponent(Gameserver.intPlayerCapacity) + '&intPlayerActive=' + encodeURIComponent(Gameserver.intPlayerActive),
				'method': 'GET'
			}, function(objectClientresponse) {
				objectClientresponse.setEncoding('UTF-8');
				
				objectClientresponse.on('data', function(strData) {
					
				});
				
				objectClientresponse.on('end', function() {
					functionSuccess();
				});
			});
			
			objectClientrequest.on('error', function(objectError) {
				functionError();
			});
			
			objectClientrequest.setTimeout(60 * 1000, function() {
				objectClientrequest.abort();
			});
			
			objectClientrequest.end();
		};
		
		var Errorsuccess_intTimestamp = new Date().getTime();
		
		var functionError = function() {
			Node.log([ 'VoxRect', String(new Date().getTime() - Errorsuccess_intTimestamp), 'Error' ]);
		};
		
		var functionSuccess = function() {
			Node.log([ 'VoxRect', String(new Date().getTime() - Errorsuccess_intTimestamp), 'Success' ]);
		};
		
		functionAdvertise();
	};
	
	setInterval(functionInterval, 5 * 60 * 1000);
	
	functionInterval();
}
}).call(this,require("buffer").Buffer,"/")
},{"buffer":3}],2:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return (b64.length * 3 / 4) - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr((len * 3 / 4) - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0; i < l; i += 4) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],3:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('Invalid typed array length')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (value instanceof ArrayBuffer) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  return fromObject(value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj) {
    if (isArrayBufferView(obj) || 'length' in obj) {
      if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
        return createBuffer(0)
      }
      return fromArrayLike(obj)
    }

    if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
      return fromArrayLike(obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (isArrayBufferView(string) || string instanceof ArrayBuffer) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : new Buffer(val, encoding)
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// Node 0.10 supports `ArrayBuffer` but lacks `ArrayBuffer.isView`
function isArrayBufferView (obj) {
  return (typeof ArrayBuffer.isView === 'function') && ArrayBuffer.isView(obj)
}

function numberIsNaN (obj) {
  return obj !== obj // eslint-disable-line no-self-compare
}

},{"base64-js":2,"ieee754":4}],4:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}]},{},[1]);
