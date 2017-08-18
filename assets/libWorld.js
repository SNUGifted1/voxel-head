'use strict';

var World = {
	browserify: function(objectBrowserify) {
		for (var strKey in objectBrowserify) {
			global[strKey] = objectBrowserify[strKey];
		}
	},

	requireSchemapack: null,

	objectPrevious: {},
	objectWorld: {},

	intSpawnRed: [],
	intSpawnBlue: [],
	intFlagRed: [],
	intFlagBlue: [],
	intSeparator: [],

	init: function() {
		{
			World.requireSchemapack = require('schemapack').build([{
				'intCoordinate': [ 'varint' ],
				'strType': 'string',
				'boolBlocked': 'bool'
			}]);
		}

		{
			World.objectPrevious = {};

			World.objectWorld = {};
		}

		{
			World.intSpawnRed = [];

			World.intSpawnBlue = [];

			World.intFlagRed = [];

			World.intFlagBlue = [];

			World.intSeparator = [];
		}
	},

	dispel: function() {
		{
			World.requireSchemapack = {};
		}

		{
			World.objectPrevious = {};

			World.objectWorld = {};
		}

		{
			World.intSpawnRed = [];

			World.intSpawnBlue = [];

			World.intFlagRed = [];

			World.intFlagBlue = [];

			World.intSeparator = [];
		}
	},

	saveBuffer: function(objectStorage) {
		var objectBuffer = null;

		{
			if (objectStorage === null) {
				objectStorage = World.objectWorld;
			}
		}

		{
			var objectSchemapack = [];

			for (var strIdent in objectStorage) {
				var objectWorld = {};

				for (var strAttribute in objectStorage[strIdent]) {
					var voidAttribute = objectStorage[strIdent][strAttribute];

					if (typeof(voidAttribute) === 'object') {
						if (Array.isArray(voidAttribute) === false) {
							continue;
						}
					}

					objectWorld[strAttribute] = voidAttribute;
				}

				objectSchemapack.push(objectWorld);
			}

			objectBuffer = World.requireSchemapack.encode(objectSchemapack).toString('base64');
		}

		return objectBuffer;
	},

	loadBuffer: function(objectStorage, objectBuffer) {
		{
			if (objectStorage === null) {
				objectStorage = World.objectWorld;
			}
		}

		{
			if (objectStorage === World.objectWorld) {
				{
					World.objectPrevious = World.objectWorld;

					World.objectWorld = {};
				}

				{
					objectStorage = World.objectWorld;
				}
			}
		}

		{
			var objectSchemapack = World.requireSchemapack.decode(new Buffer(objectBuffer, 'base64'));

			for (var intFor1 = 0; intFor1 < objectSchemapack.length; intFor1 += 1) {
				var objectWorld = {};

				for (var strAttribute in objectSchemapack[intFor1]) {
					objectWorld[strAttribute] = objectSchemapack[intFor1][strAttribute];
				}

				objectStorage[(objectWorld.intCoordinate[0] << 20) + (objectWorld.intCoordinate[1] << 10) + (objectWorld.intCoordinate[2] << 0)] = objectWorld;
			}
		}

		{
			if (objectStorage === World.objectWorld) {
				{
					World.intSpawnRed = [];

					World.intSpawnBlue = [];

					World.intFlagRed = [];

					World.intFlagBlue = [];

					World.intSeparator = [];
				}

				{
					for (var strCoordinate in World.objectWorld) {
						var objectWorld = World.objectWorld[strCoordinate];

						{
							if (objectWorld.strType === 'voxelSpawnRed') {
								World.intSpawnRed.push(objectWorld.intCoordinate);

							} else if (objectWorld.strType === 'voxelSpawnBlue') {
								World.intSpawnBlue.push(objectWorld.intCoordinate);

							} else if (objectWorld.strType === 'voxelFlagRed') {
								World.intFlagRed.push(objectWorld.intCoordinate);

							} else if (objectWorld.strType === 'voxelFlagBlue') {
								World.intFlagBlue.push(objectWorld.intCoordinate);

							} else if (objectWorld.strType === 'voxelSeparator') {
								World.intSeparator.push(objectWorld.intCoordinate);

							}
						}
					}
				}
			}
		}
	},

	update: function() {
		{
			World.updateLogic();
		}

		if (Voxel === null) {
			return;
		}

		{
			World.updateGraphics();
		}
	},

	updateLogic: function() {

	},

	updateGraphics: function() {
		{
			if (World.objectPrevious !== null) {
				{
					for (var strCoordinate in World.objectPrevious) {
						var objectWorld = World.objectPrevious[strCoordinate];

						{
							Voxel.requireVoxelengine.setBlock(objectWorld.intCoordinate, 0);
						}
					}

					for (var strCoordinate in World.objectWorld) {
						var objectWorld = World.objectWorld[strCoordinate];

						{
							Voxel.requireVoxelengine.setBlock(objectWorld.intCoordinate, Voxel.requireVoxelengine.materials.find(objectWorld.strType));
						}
					}
				}

				{
					World.objectPrevious = null;
				}
			}
		}
	},

	updateCreate: function(intCoordinate, strType, boolBlocked) {
		{
			World.objectWorld[(intCoordinate[0] << 20) + (intCoordinate[1] << 10) + (intCoordinate[2] << 0)] = {
				'intCoordinate': intCoordinate,
				'strType': strType,
				'boolBlocked': boolBlocked
			};
		}

		if (Voxel === null) {
			return;
		}

		{
			Voxel.requireVoxelengine.setBlock(intCoordinate, Voxel.requireVoxelengine.materials.find(strType));
		}
	},

	updateDestroy: function(intCoordinate) {
		{
			delete World.objectWorld[(intCoordinate[0] << 20) + (intCoordinate[1] << 10) + (intCoordinate[2] << 0)];
		}

		if (Voxel === null) {
			return;
		}

		{
			Voxel.requireVoxelengine.setBlock(intCoordinate, 0);
		}
	},

	updateBlocked: function(intCoordinate) {
		{
			if (World.objectWorld[(intCoordinate[0] << 20) + (intCoordinate[1] << 10) + (intCoordinate[2] << 0)] !== undefined) {
				if (World.objectWorld[(intCoordinate[0] << 20) + (intCoordinate[1] << 10) + (intCoordinate[2] << 0)].boolBlocked === true) {
					return true;
				}
			}
		}

		{
			for (var intFor1 = -1; intFor1 < 2; intFor1 += 1) {
				for (var intFor2 = 1; intFor2 < 3; intFor2 += 1) {
					for (var intFor3 = -1; intFor3 < 2; intFor3 += 1) {
						for (var intFor4 = 0; intFor4 < World.intSpawnRed.length; intFor4 += 1) {
							var intCoordinateX = World.intSpawnRed[intFor4][0] + intFor1;
							var intCoordinateY = World.intSpawnRed[intFor4][1] + intFor2;
							var intCoordinateZ = World.intSpawnRed[intFor4][2] + intFor3;

							if (intCoordinateX === intCoordinate[0]) {
								if (intCoordinateY === intCoordinate[1]) {
									if (intCoordinateZ === intCoordinate[2]) {
										return true;
									}
								}
							}
						}

						for (var intFor4 = 0; intFor4 < World.intSpawnBlue.length; intFor4 += 1) {
							var intCoordinateX = World.intSpawnBlue[intFor4][0] + intFor1;
							var intCoordinateY = World.intSpawnBlue[intFor4][1] + intFor2;
							var intCoordinateZ = World.intSpawnBlue[intFor4][2] + intFor3;

							if (intCoordinateX === intCoordinate[0]) {
								if (intCoordinateY === intCoordinate[1]) {
									if (intCoordinateZ === intCoordinate[2]) {
										return true;
									}
								}
							}
						}
					}
				}
			}

			for (var intFor1 = -1; intFor1 < 2; intFor1 += 1) {
				for (var intFor2 = 0; intFor2 < 2; intFor2 += 1) {
					for (var intFor3 = -1; intFor3 < 2; intFor3 += 1) {
						for (var intFor4 = 0; intFor4 < World.intFlagRed.length; intFor4 += 1) {
							var intCoordinateX = World.intFlagRed[intFor4][0] + intFor1;
							var intCoordinateY = World.intFlagRed[intFor4][1] + intFor2;
							var intCoordinateZ = World.intFlagRed[intFor4][2] + intFor3;

							if (intCoordinateX === intCoordinate[0]) {
								if (intCoordinateY === intCoordinate[1]) {
									if (intCoordinateZ === intCoordinate[2]) {
										return true;
									}
								}
							}
						}

						for (var intFor4 = 0; intFor4 < World.intFlagBlue.length; intFor4 += 1) {
							var intCoordinateX = World.intFlagBlue[intFor4][0] + intFor1;
							var intCoordinateY = World.intFlagBlue[intFor4][1] + intFor2;
							var intCoordinateZ = World.intFlagBlue[intFor4][2] + intFor3;

							if (intCoordinateX === intCoordinate[0]) {
								if (intCoordinateY === intCoordinate[1]) {
									if (intCoordinateZ === intCoordinate[2]) {
										return true;
									}
								}
							}
						}
					}
				}
			}
		}

		return false;
	}
};

module.exports = World;
