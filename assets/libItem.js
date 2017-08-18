'use strict';

var Item = {
	browserify: function(objectBrowserify) {
		for (var strKey in objectBrowserify) {
			global[strKey] = objectBrowserify[strKey];
		}
	},

	requireSchemapack: null,

	objectItem: {},

	objectRepository: {},

	functionFlagInit: null,
	functionFlagPlayer: null,

	init: function() {
		{
			Item.requireSchemapack = require('schemapack').build([{
				'strIdent': 'string',
				'strPlayer': 'string',
				'dblPosition': [ 'float32' ],
				'dblVerlet': [ 'float32' ],
				'dblAcceleration': [ 'float32' ],
				'dblRotation': [ 'float32' ]
			}]);
		}

		{
			Item.objectItem = {};
		}

		if (Voxel === null) {
			return;
		}

		{
			Item.objectRepository = {
				'entityFlag': {
					'intLength': 0,
					'objectEntity': []
				},
				'entityArrow': {
					'intLength': 0,
					'objectEntity': []
				}
			};

			Item.objectRepository['entityFlag'].objectEntity.push(Voxel.entityCreate('entityFlagRed', Constants.dblGameScale));
			Item.objectRepository['entityFlag'].objectEntity.push(Voxel.entityCreate('entityFlagBlue', Constants.dblGameScale));

			for (var intFor1 = 0; intFor1 < 32; intFor1 += 1) {
				Item.objectRepository['entityArrow'].objectEntity.push(Voxel.entityCreate('entityArrow', Constants.dblGameScale));
			}
		}

		{
			Item.functionFlagInit = function(objectItem) {

			};

			Item.functionFlagPlayer = function(objectItem) {

			};
		}
	},

	dispel: function() {
		{
			Item.requireSchemapack = {};
		}

		{
			Item.objectItem = {};
		}

		{
			Item.objectRepository = {};
		}

		{
			Item.functionFlagInit = null;

			Item.functionFlagPlayer = null;
		}
	},

	initFlag: function(objectItem) {
		{
			if (Item.objectItem['itemFlag - teamRed'] === undefined) {
				Item.objectItem['itemFlag - teamRed'] = {
					'strIdent': 'itemFlag - teamRed',
					'strPlayer': 'playerInitial',
					'dblPosition': [ 0.0, 0.0, 0.0 ],
					'dblVerlet': [ 0.0, 0.0, 0.0 ],
					'dblAcceleration': [ 0.0, 0.0, 0.0 ],
					'dblRotation': [ 0.0, 0.0, 0.0 ]
				};

				Item.functionFlagInit(Item.objectItem['itemFlag - teamRed']);
			}

			if (Item.objectItem['itemFlag - teamBlue'] === undefined) {
				Item.objectItem['itemFlag - teamBlue'] = {
					'strIdent': 'itemFlag - teamBlue',
					'strPlayer': 'playerInitial',
					'dblPosition': [ 0.0, 0.0, 0.0 ],
					'dblVerlet': [ 0.0, 0.0, 0.0 ],
					'dblAcceleration': [ 0.0, 0.0, 0.0 ],
					'dblRotation': [ 0.0, 0.0, 0.0 ]
				};

				Item.functionFlagInit(Item.objectItem['itemFlag - teamBlue']);
			}
		}

		{
			if (objectItem !== undefined) {
				Item.functionFlagInit(objectItem);
			}
		}
	},

	saveBuffer: function(objectStorage) {
		var objectBuffer = null;

		{
			if (objectStorage === null) {
				objectStorage = Item.objectItem;
			}
		}

		{
			var objectSchemapack = [];

			for (var strIdent in objectStorage) {
				var objectItem = {};

				for (var strAttribute in objectStorage[strIdent]) {
					var voidAttribute = objectStorage[strIdent][strAttribute];

					if (typeof(voidAttribute) === 'object') {
						if (Array.isArray(voidAttribute) === false) {
							continue;
						}
					}

					objectItem[strAttribute] = voidAttribute;
				}

				objectSchemapack.push(objectItem);
			}

			objectBuffer = Item.requireSchemapack.encode(objectSchemapack).toString('base64');
		}

		return objectBuffer;
	},

	loadBuffer: function(objectStorage, objectBuffer) {
		{
			if (objectStorage === null) {
				objectStorage = Item.objectItem;
			}
		}

		{
			var objectSchemapack = Item.requireSchemapack.decode(new Buffer(objectBuffer, 'base64'));

			for (var intFor1 = 0; intFor1 < objectSchemapack.length; intFor1 += 1) {
				var objectItem = {};

				for (var strAttribute in objectSchemapack[intFor1]) {
					objectItem[strAttribute] = objectSchemapack[intFor1][strAttribute];
				}

				objectStorage[objectItem.strIdent] = objectItem;
			}
		}
	},

	update: function() {
		{
			Item.updateLogic();
		}

		if (Voxel === null) {
			return;
		}

		{
			Item.updateGraphics();
		}
	},

	updateLogic: function() {
		{
			for (var strIdent in Item.objectItem) {
				var objectItem = Item.objectItem[strIdent];

				{
					if (objectItem.strIdent.indexOf('itemFlag') === 0) {
						{
							objectItem.dblSize = Constants.dblFlagSize;
							objectItem.dblGravity = Constants.dblFlagGravity;
							objectItem.dblMaxvel = Constants.dblFlagMaxvel;
							objectItem.dblFriction = Constants.dblFlagFriction;

							Physics.update(objectItem);
							Physics.updateWorldcol(objectItem, false);
						}

						{
							objectItem.dblRotation[1] = (objectItem.dblRotation[1] + Constants.dblFlagRotate) % (2.0 * Math.PI);
						}

						{
							Item.functionFlagPlayer(objectItem);
						}

					} else if (objectItem.strIdent.indexOf('itemArrow') === 0) {
						{
							objectItem.dblSize = Constants.dblArrowSize;
							objectItem.dblGravity = Constants.dblArrowGravity;
							objectItem.dblMaxvel = Constants.dblArrowMaxvel;
							objectItem.dblFriction = Constants.dblArrowFriction;

							Physics.update(objectItem);
							Physics.updateWorldcol(objectItem, false);
						}

						{
							var dblVelocityX = objectItem.dblPosition[0] - objectItem.dblVerlet[0];
							var dblVelocityY = objectItem.dblPosition[1] - objectItem.dblVerlet[1];
							var dblVelocityZ = objectItem.dblPosition[2] - objectItem.dblVerlet[2];

							objectItem.dblRotation[0] = 0.0;
							objectItem.dblRotation[1] = Math.atan2(dblVelocityX, dblVelocityZ) + (1.0 * Math.PI);
							objectItem.dblRotation[2] = Math.atan2(dblVelocityY, Math.sqrt((dblVelocityX * dblVelocityX) + (dblVelocityZ * dblVelocityZ)));
						}

						{
							if (objectItem.boolCollisionTop === true) {
								delete Item.objectItem[objectItem.strIdent];

							} else if (objectItem.boolCollisionSide === true) {
								delete Item.objectItem[objectItem.strIdent];

							} else if (objectItem.boolCollisionBottom === true) {
								delete Item.objectItem[objectItem.strIdent];

							}
						}

					}
				}
			}
		}
	},

	updateGraphics: function() {
		{
			Item.objectRepository['entityFlag'].intLength = 2;

			Item.objectRepository['entityArrow'].intLength = 0;
		}

		{
			for (var strIdent in Item.objectItem) {
				var objectItem = Item.objectItem[strIdent];

				{
					var objectEntity = null;

					{
						if (objectItem.strIdent === 'itemFlag - teamRed') {
							objectEntity = Item.objectRepository['entityFlag'].objectEntity[0];

						} else if (objectItem.strIdent === 'itemFlag - teamBlue') {
							objectEntity = Item.objectRepository['entityFlag'].objectEntity[1];

						} else if (objectItem.strIdent.indexOf('itemArrow') === 0) {
							objectEntity = Item.objectRepository['entityArrow'].objectEntity[Item.objectRepository['entityArrow'].intLength++];

						}
					}

					{
						if (objectItem.strIdent.indexOf('itemFlag') === 0) {
							objectEntity.position.x = objectItem.dblPosition[0];
							objectEntity.position.y = objectItem.dblPosition[1];
							objectEntity.position.z = objectItem.dblPosition[2];

							objectEntity.rotation.x = objectItem.dblRotation[0];
							objectEntity.rotation.y = objectItem.dblRotation[1];
							objectEntity.rotation.z = objectItem.dblRotation[2];

						} else if (objectItem.strIdent.indexOf('itemArrow') === 0) {
							objectEntity.position.x = objectItem.dblPosition[0];
							objectEntity.position.y = objectItem.dblPosition[1];
							objectEntity.position.z = objectItem.dblPosition[2];

							objectEntity.rotation.x = objectItem.dblRotation[0];
							objectEntity.rotation.y = objectItem.dblRotation[1] + (0.5 * Math.PI);
							objectEntity.rotation.z = objectItem.dblRotation[2] + (1.25 * Math.PI);

						}
					}
				}
			}
		}

		{
			for (var strEntity in Item.objectRepository) {
				for (var intFor1 = 0; intFor1 < Item.objectRepository[strEntity].intLength; intFor1 += 1) {
					if (Item.objectRepository[strEntity].objectEntity[intFor1].parent === undefined) {
						Voxel.requireVoxelengine.scene.add(Item.objectRepository[strEntity].objectEntity[intFor1]);
					}
				}

				for (var intFor1 = Item.objectRepository[strEntity].intLength; intFor1 < Item.objectRepository[strEntity].objectEntity.length; intFor1 += 1) {
					if (Item.objectRepository[strEntity].objectEntity[intFor1].parent !== undefined) {
						Voxel.requireVoxelengine.scene.remove(Item.objectRepository[strEntity].objectEntity[intFor1]);
					}
				}
			}
		}
	}
};

module.exports = Item;
