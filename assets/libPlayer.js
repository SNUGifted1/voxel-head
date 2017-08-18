'use strict';
var Player = {
	browserify: function(objectBrowserify) {
		for (var strKey in objectBrowserify) {
			global[strKey] = objectBrowserify[strKey];
		}
	},

	requireSchemapack: null,

	objectPlayer: {},

	objectRepository: {},

	init: function() {
		{
			Player.requireSchemapack = require('schemapack').build([{
				'strIdent': 'string',
				'intTeam': 'varint',
				'intEntity': 'varint',
				'strName': 'string',
				'intScore': 'varint',
				'intKills': 'varint',
				'intDeaths': 'varint',
				'intHealth': 'varint',
				'dblPosition': [ 'float32' ],
				'dblVerlet': [ 'float32' ],
				'dblGravity': [ 'float32' ],
				'dblAcceleration': [ 'float32' ],
				'dblRotation': [ 'float32' ],
				'intJumpcount': 'varint',
				'intWalk': 'varint',
				'intWeapon': 'varint',
				'boolFly': 'bool'
			}]);
		}

		{
			Player.objectPlayer = {};
		}

		if (Voxel === null) {
			return;
		}

		{
			Player.objectRepository = {
				'characterController': {
					'intLength': 0,
					'objectCharacter': []
				},
				'characterRed': {
					'intLength': 0,
					'objectCharacter': []
				},
				'characterBlue': {
					'intLength': 0,
					'objectCharacter': []
				}
			};

			Player.objectRepository['characterController'].objectCharacter.push(Voxel.characterCreate('characterGreen'));

			for (var intFor1 = 0; intFor1 < 16; intFor1 += 1) {
				Player.objectRepository['characterRed'].objectCharacter.push(Voxel.characterCreate('characterRed'));
				Player.objectRepository['characterBlue'].objectCharacter.push(Voxel.characterCreate('characterBlue'));
			}
		}
	},

	dispel: function() {
		{
			Player.requireSchemapack = {};
		}

		{
			Player.objectPlayer = {};
		}

		{
			Player.objectRepository = {};
		}
	},

	initController: function() {
		{
			Player.objectPlayer['1'] = {
				'strIdent': '1',
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
				'intWeapon': 0,
				'boolFly': false
			};
		}

		{
			Player.objectRepository['characterController'].objectCharacter[0].mesh.cameraInside.add(Voxel.requireVoxelengine.camera);
		}

		{
			var objectController = Voxel.requireVoxelengine.makePhysical(Player.objectRepository['characterController'].objectCharacter[0].mesh, null, true);

			{
				objectController.position = Player.objectRepository['characterController'].objectCharacter[0].mesh.position;

				objectController.roll = null;
				objectController.yaw = Player.objectRepository['characterController'].objectCharacter[0].mesh;
				objectController.pitch = Player.objectRepository['characterController'].objectCharacter[0].mesh.head;
			}

			Voxel.requireVoxelengine.control(objectController);
		}
	},

	saveBuffer: function(objectStorage) {
		var objectBuffer = null;

		{
			if (objectStorage === null) {
				objectStorage = Player.objectPlayer;
			}
		}

		{
			var objectSchemapack = [];

			for (var strIdent in objectStorage) {
				var objectPlayer = {};

				for (var strAttribute in objectStorage[strIdent]) {
					var voidAttribute = objectStorage[strIdent][strAttribute];

					if (typeof(voidAttribute) === 'object') {
						if (Array.isArray(voidAttribute) === false) {
							continue;
						}
					}

					if (strAttribute === 'strTeam') {
						strAttribute = 'intTeam';

						if (voidAttribute === '') {
							voidAttribute = 0;

						} else if (voidAttribute === 'teamRed') {
							voidAttribute = 1;

						} else if (voidAttribute === 'teamBlue') {
							voidAttribute = 2;

						}

					} else if (strAttribute === 'strEntity') {
						strAttribute = 'intEntity';

						if (voidAttribute === '') {
							voidAttribute = 0;

						} else if (voidAttribute === 'entityPickaxe') {
							voidAttribute = 1;

						} else if (voidAttribute === 'entitySword') {
							voidAttribute = 2;

						} else if (voidAttribute === 'entityBow') {
							voidAttribute = 3;

						}

					}

					objectPlayer[strAttribute] = voidAttribute;
				}
				objectSchemapack.push(objectPlayer);
			}

			objectBuffer = Player.requireSchemapack.encode(objectSchemapack).toString('base64');
		}

		return objectBuffer;
	},

	loadBuffer: function(objectStorage, objectBuffer) {
		{
			if (objectStorage === null) {
				objectStorage = Player.objectPlayer;
			}
		}

		{
			var objectSchemapack = Player.requireSchemapack.decode(new Buffer(objectBuffer, 'base64'));

			for (var intFor1 = 0; intFor1 < objectSchemapack.length; intFor1 += 1) {
				var objectPlayer = {};

				for (var strAttribute in objectSchemapack[intFor1]) {
					var voidAttribute = objectSchemapack[intFor1][strAttribute];

					if (strAttribute === 'intTeam') {
						strAttribute = 'strTeam';

						if (voidAttribute === 0) {
							voidAttribute = '';

						} if (voidAttribute === 1) {
							voidAttribute = 'teamRed';

						} else if (voidAttribute === 2) {
							voidAttribute = 'teamBlue';

						}

					} else if (strAttribute === 'intEntity') {
						strAttribute = 'strEntity';

						if (voidAttribute === 0) {
							voidAttribute = '';

						} else if (voidAttribute === 1) {
							voidAttribute = 'entityPickaxe';

						} else if (voidAttribute === 2) {
							voidAttribute = 'entitySword';

						} else if (voidAttribute === 3) {
							voidAttribute = 'entityBow';

						}

					}

					objectPlayer[strAttribute] = voidAttribute;
				}
				objectStorage[objectPlayer.strIdent] = objectPlayer;
			}
		}
	},

	update: function() {
		{
			Player.updateLogic();
		}

		if (Voxel === null) {
			return;
		}

		{
			Player.updateGraphics();
		}
	},

	updateLogic: function() {
		{
			if (Player.objectPlayer['1'] !== undefined) {
				Player.objectPlayer['1'].dblRotation[0] = 0.0;
				Player.objectPlayer['1'].dblRotation[1] = Player.objectRepository['characterController'].objectCharacter[0].mesh.rotation.y;
				Player.objectPlayer['1'].dblRotation[2] = Player.objectRepository['characterController'].objectCharacter[0].mesh.head.rotation.x;
			}
		}

		{
			for (var strIdent in Player.objectPlayer) {
				var objectPlayer = Player.objectPlayer[strIdent];

				if (objectPlayer.strTeam === '') {
					continue;
				}

				{
					objectPlayer.dblSize = Constants.dblPlayerSize;
					if (objectPlayer.dblGravity === null || objectPlayer.dblGravity === undefined)
					objectPlayer.dblGravity = Constants.dblPlayerGravity;
					objectPlayer.dblMaxvel = Constants.dblPlayerMaxvel;
					objectPlayer.dblFriction = Constants.dblPlayerFriction;

					Physics.update(objectPlayer);
					Physics.updateWorldcol(objectPlayer, false);
				}

				{
					if (objectPlayer.boolCollisionBottom === true) {
						if (Math.abs(objectPlayer.dblPosition[1] - objectPlayer.dblVerlet[1]) < 0.0001) {
							objectPlayer.intJumpcount = 1;
						}
					}
				}

				{
					var dblVelocityX = objectPlayer.dblPosition[0] - objectPlayer.dblVerlet[0];
					var dblVelocityY = objectPlayer.dblPosition[1] - objectPlayer.dblVerlet[1];
					var dblVelocityZ = objectPlayer.dblPosition[2] - objectPlayer.dblVerlet[2];

					if (Math.abs(dblVelocityX) > 0.01) {
						objectPlayer.intWalk += 1

					} else if (Math.abs(dblVelocityZ) > 0.01) {
						objectPlayer.intWalk += 1;

					}

					if (Math.abs(dblVelocityX) < 0.01) {
						if (Math.abs(dblVelocityZ) < 0.01) {
							objectPlayer.intWalk = 0;
						}
					}

					if (objectPlayer.intWeapon > 0) {
						objectPlayer.intWeapon -= 1;
					}
				}
			}
		}

	},

	updateGraphics: function() {
		{
			Player.objectRepository['characterController'].intLength = 1;

			Player.objectRepository['characterRed'].intLength = 0;

			Player.objectRepository['characterBlue'].intLength = 0;
		}

		{
			for (var strIdent in Player.objectPlayer) {
				var objectPlayer = Player.objectPlayer[strIdent];

				if (objectPlayer.strTeam === '') {
					continue;
				}

				{
					var objectCharacter = null;

					{
						if (objectPlayer.strIdent === '1') {
							objectCharacter = Player.objectRepository['characterController'].objectCharacter[0];

						} else if (objectPlayer.strIdent !== '1') {
							if (objectPlayer.strTeam === 'teamRed') {
								objectCharacter = Player.objectRepository['characterRed'].objectCharacter[Player.objectRepository['characterRed'].intLength++];

							} else if (objectPlayer.strTeam === 'teamBlue') {
								objectCharacter = Player.objectRepository['characterBlue'].objectCharacter[Player.objectRepository['characterBlue'].intLength++];

							}

						}
					}

					{
						if (objectPlayer.strIdent === '1') {
							objectCharacter.mesh.position.x = objectPlayer.dblPosition[0];
							objectCharacter.mesh.position.y = objectPlayer.dblPosition[1] - (0.5 * Constants.dblPlayerSize[1]);
							objectCharacter.mesh.position.z = objectPlayer.dblPosition[2];

						} else if (objectPlayer.strIdent !== '1') {
							objectCharacter.mesh.position.x = objectPlayer.dblPosition[0];
							objectCharacter.mesh.position.y = objectPlayer.dblPosition[1] - (0.5 * Constants.dblPlayerSize[1]);
							objectCharacter.mesh.position.z = objectPlayer.dblPosition[2];

							objectCharacter.mesh.rotation.y = objectPlayer.dblRotation[1];

							objectCharacter.mesh.head.rotation.x = objectPlayer.dblRotation[2];

						}
					}

					{
						Voxel.characterUpdate(objectCharacter, objectPlayer);
					}
				}
			}
		}

		{
			for (var strCharacter in Player.objectRepository) {
				for (var intFor1 = 0; intFor1 < Player.objectRepository[strCharacter].intLength; intFor1 += 1) {
					if (Player.objectRepository[strCharacter].objectCharacter[intFor1].mesh.parent === undefined) {
						Voxel.requireVoxelengine.scene.add(Player.objectRepository[strCharacter].objectCharacter[intFor1].mesh);
					}
				}

				for (var intFor1 = Player.objectRepository[strCharacter].intLength; intFor1 < Player.objectRepository[strCharacter].objectCharacter.length; intFor1 += 1) {
					if (Player.objectRepository[strCharacter].objectCharacter[intFor1].mesh.parent !== undefined) {
						Voxel.requireVoxelengine.scene.remove(Player.objectRepository[strCharacter].objectCharacter[intFor1].mesh);
					}
				}
			}
		}
	}
};
module.exports = Player;
