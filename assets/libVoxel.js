'use strict';

var Voxel = {
	browserify: function(objectBrowserify) {
		for (var strKey in objectBrowserify) {
			global[strKey] = objectBrowserify[strKey];
		}
	},

	requireVoxelengine: null,

	requireVoxelhighlight: null,

	requireMinecraftskin: null,

	objectEntity: {},

	init: function(functionGenerate) {
		{
			Voxel.requireVoxelengine = require('voxel-engine')({
				'texturePath': './images/',
				'generate': functionGenerate,
				'materials': [ 'voxelVoid', 'voxelBrick', 'voxelDirt', 'voxelGrass', 'voxelPlank', 'voxelStone', 'voxelSpawnRed', 'voxelSpawnBlue', 'voxelFlagRed', 'voxelFlagBlue', 'voxelSeparator' ],
				'controls': {
					'discreteFire': true
				},
				'fogDisabled': false,
				'statsDisabled': true
			});

			Voxel.requireVoxelengine.appendTo(window.document.body);
		}

		{
			Voxel.requireVoxelhighlight = require('voxel-highlight')(Voxel.requireVoxelengine, {
				'enabled': function() {
					return false;
				},
				'distance': 8,
				'wireframeLinewidth': 16,
				'wireframeOpacity': 1.0,
				'color': 0xFFFFFF,
				'adjacentActive': function() {
					return false;
				},
				'selectActive': function() {
					return false;
				}
			});

			Voxel.requireVoxelhighlight.intCreate = null;
			Voxel.requireVoxelhighlight.intDestroy = null;

			Voxel.requireVoxelhighlight.on('highlight-adjacent', function(objectPosition) {
				Voxel.requireVoxelhighlight.intCreate = objectPosition;
			});

			Voxel.requireVoxelhighlight.on('remove-adjacent', function(objectPosition) {
				Voxel.requireVoxelhighlight.intCreate = null;
			});

			Voxel.requireVoxelhighlight.on('highlight', function(objectPosition) {
				Voxel.requireVoxelhighlight.intDestroy = objectPosition;
			});

			Voxel.requireVoxelhighlight.on('remove', function(objectPosition) {
				Voxel.requireVoxelhighlight.intDestroy = null;
			});
		}

		{
			Voxel.requireMinecraftskin = require('minecraft-skin');
		}

		{
			Voxel.objectEntity = {};
		}
	},

	dispel: function() {
		{
			Voxel.requireVoxelengine = null;
		}

		{
			Voxel.requireVoxelhighlight = null;
		}

		{
			Voxel.requireMinecraftskin = null;
		}

		{
			Voxel.objectEntity = {};
		}
	},

	characterCreate: function(strCharacter) {
		var objectCharacter = Voxel.requireMinecraftskin(Voxel.requireVoxelengine.THREE, '', {
			'scale': new Voxel.requireVoxelengine.THREE.Vector3(Constants.dblGameScale, Constants.dblGameScale, Constants.dblGameScale)
		});

		{
			if (strCharacter === 'characterGreen') {
				objectCharacter.setImage(jQuery('#idCharacterGreen').get(0));

			} else if (strCharacter === 'characterRed') {
				objectCharacter.setImage(jQuery('#idCharacterRed').get(0));

			} else if (strCharacter === 'characterBlue') {
				objectCharacter.setImage(jQuery('#idCharacterBlue').get(0));

			}
		}

		{
			objectCharacter.strEntity = '';
		}

		{
			objectCharacter.objectPickaxe = Voxel.entityCreate('entityPickaxe', 1.0);

			objectCharacter.objectPickaxe.position.x = 0.0 + 6.0;
			objectCharacter.objectPickaxe.position.y = 0.0 - 9.5;
			objectCharacter.objectPickaxe.position.z = 0.0;

			objectCharacter.objectPickaxe.rotation.x = 0.0;
			objectCharacter.objectPickaxe.rotation.y = 0.0;
			objectCharacter.objectPickaxe.rotation.z = 1.25 * Math.PI;
		}

		{
			objectCharacter.objectSword = Voxel.entityCreate('entitySword', 1.0);

			objectCharacter.objectSword.position.x = 0.0 + 7.0;
			objectCharacter.objectSword.position.y = 0.0 - 9.5;
			objectCharacter.objectSword.position.z = 0.0;

			objectCharacter.objectSword.rotation.x = 0.0;
			objectCharacter.objectSword.rotation.y = 0.0;
			objectCharacter.objectSword.rotation.z = 1.25 * Math.PI;
		}

		{
			objectCharacter.objectBow = Voxel.entityCreate('entityBow', 1.0);

			objectCharacter.objectBow.position.x = 0.0;
			objectCharacter.objectBow.position.y = 0.0 - 7.5;
			objectCharacter.objectBow.position.z = 0.0;

			objectCharacter.objectBow.rotation.x = 0.0;
			objectCharacter.objectBow.rotation.y = 0.0;
			objectCharacter.objectBow.rotation.z = 1.25 * Math.PI;
		}

		return objectCharacter;
	},

	characterUpdate: function(objectCharacter, objectPlayer) {
		{
			if (objectCharacter.strEntity !== objectPlayer.strEntity) {
				objectCharacter.rightArm.remove(objectCharacter.objectPickaxe);
				objectCharacter.rightArm.remove(objectCharacter.objectSword);
				objectCharacter.rightArm.remove(objectCharacter.objectBow);

				if (objectPlayer.strEntity === 'entityPickaxe') {
					objectCharacter.rightArm.add(objectCharacter.objectPickaxe);

				} else if (objectPlayer.strEntity === 'entitySword') {
					objectCharacter.rightArm.add(objectCharacter.objectSword);

				} else if (objectPlayer.strEntity === 'entityBow') {
					objectCharacter.rightArm.add(objectCharacter.objectBow);

				}

				objectCharacter.strEntity = objectPlayer.strEntity;
			}
		}

		{
			if (objectPlayer.strEntity === '') {
				objectCharacter.rightArm.rotation.z = 2.0 * Math.cos((0.08 * objectPlayer.intWalk) + (1.5 * Math.PI));
				objectCharacter.leftArm.rotation.z = 2.0 * Math.cos((0.08 * objectPlayer.intWalk) + (0.5 * Math.PI));

				objectCharacter.rightLeg.rotation.z = 1.4 * Math.cos((0.08 * objectPlayer.intWalk) + (0.5 * Math.PI));
				objectCharacter.leftLeg.rotation.z = 1.4 * Math.cos((0.08 * objectPlayer.intWalk) + (1.5 * Math.PI));

			} else if (objectPlayer.strEntity === 'entityPickaxe') {
				var dblWeapon = 0.0;

				if (objectPlayer.intWeapon === 0) {
					dblWeapon = 0.47 * Math.PI;

				} else if (objectPlayer.intWeapon !== 0) {
					var dblProgress = 1.0 - (parseFloat(objectPlayer.intWeapon) / parseFloat(Constants.intInteractionPickaxeDuration));

					if (dblProgress < 0.3) {
						dblProgress = (dblProgress - 0.0) / 0.3;

						dblWeapon = (0.47 * Math.PI) + (dblProgress * 0.5 * Math.PI);

					} else if (dblProgress < 0.7) {
						dblProgress = (dblProgress - 0.3) / 0.4;

						dblWeapon = (0.97 * Math.PI) - (dblProgress * 1.0 * Math.PI);

					} else if (dblProgress < 1.0) {
						dblProgress = (dblProgress - 0.7) / 0.3;

						dblWeapon = (-0.03 * Math.PI) + (dblProgress * 0.5 * Math.PI);

					}

				}

				objectCharacter.rightArm.rotation.z = objectCharacter.mesh.head.rotation.x + dblWeapon;
				objectCharacter.leftArm.rotation.z = 2.0 * Math.cos((0.08 * objectPlayer.intWalk) + (0.5 * Math.PI));

				objectCharacter.rightLeg.rotation.z = 1.4 * Math.cos((0.08 * objectPlayer.intWalk) + (0.5 * Math.PI));
				objectCharacter.leftLeg.rotation.z = 1.4 * Math.cos((0.08 * objectPlayer.intWalk) + (1.5 * Math.PI));

			} else if (objectPlayer.strEntity === 'entitySword') {
				var dblWeapon = 0.0;

				if (objectPlayer.intWeapon === 0) {
					dblWeapon = 0.47 * Math.PI;

				} else if (objectPlayer.intWeapon !== 0) {
					var dblProgress = 1.0 - (parseFloat(objectPlayer.intWeapon) / parseFloat(Constants.intInteractionSwordDuration));

					if (dblProgress < 0.3) {
						dblProgress = (dblProgress - 0.0) / 0.3;

						dblWeapon = (0.47 * Math.PI) + (dblProgress * 0.5 * Math.PI);

					} else if (dblProgress < 0.7) {
						dblProgress = (dblProgress - 0.3) / 0.4;

						dblWeapon = (0.97 * Math.PI) - (dblProgress * 1.0 * Math.PI);

					} else if (dblProgress < 1.0) {
						dblProgress = (dblProgress - 0.7) / 0.3;

						dblWeapon = (-0.03 * Math.PI) + (dblProgress * 0.5 * Math.PI);

					}

				}

				objectCharacter.rightArm.rotation.z = objectCharacter.mesh.head.rotation.x + dblWeapon;
				objectCharacter.leftArm.rotation.z = 2.0 * Math.cos((0.08 * objectPlayer.intWalk) + (0.5 * Math.PI));

				objectCharacter.rightLeg.rotation.z = 1.4 * Math.cos((0.08 * objectPlayer.intWalk) + (0.5 * Math.PI));
				objectCharacter.leftLeg.rotation.z = 1.4 * Math.cos((0.08 * objectPlayer.intWalk) + (1.5 * Math.PI));

			} else if (objectPlayer.strEntity === 'entityBow') {
				objectCharacter.rightArm.rotation.z = objectCharacter.mesh.head.rotation.x + (0.47 * Math.PI);
				objectCharacter.leftArm.rotation.z = 2.0 * Math.cos((0.08 * objectPlayer.intWalk) + (0.5 * Math.PI));

				objectCharacter.rightLeg.rotation.z = 1.4 * Math.cos((0.08 * objectPlayer.intWalk) + (0.5 * Math.PI));
				objectCharacter.leftLeg.rotation.z = 1.4 * Math.cos((0.08 * objectPlayer.intWalk) + (1.5 * Math.PI));

			}
		}
	},

	entityCreate: function(strEntity, dblScale) {
		var strFingerprint = '';

		strFingerprint += strEntity + ';';
		strFingerprint += dblScale + ';';

		if (Voxel.objectEntity[strFingerprint] === undefined) {
			var objectContext = window.document.createElement('canvas').getContext('2d');

			{
				if (strEntity === 'entityFlagRed') {
					objectContext.drawImage(jQuery('#idEntityFlagRed').get(0), 0, 0);

				} else if (strEntity === 'entityFlagBlue') {
					objectContext.drawImage(jQuery('#idEntityFlagBlue').get(0), 0, 0);

				} else if (strEntity === 'entityPickaxe') {
					objectContext.drawImage(jQuery('#idEntityPickaxe').get(0), 0, 0);

				} else if (strEntity === 'entitySword') {
					objectContext.drawImage(jQuery('#idEntitySword').get(0), 0, 0);

				} else if (strEntity === 'entityBow') {
					objectContext.drawImage(jQuery('#idEntityBow').get(0), 0, 0);

				} else if (strEntity === 'entityArrow') {
					objectContext.drawImage(jQuery('#idEntityArrow').get(0), 0, 0);

				}
			}

			var objectEntity = new Voxel.requireVoxelengine.THREE.Geometry();

			{
				for (var intFor1 = 0; intFor1 < 16; intFor1 += 1) {
					for (var intFor2 = 0; intFor2 < 16; intFor2 += 1) {
						var intColor = objectContext.getImageData(intFor1, intFor2, 1, 1).data

						if (intColor[3] === 0) {
							continue;
						}

						{
							var objectCube = new Voxel.requireVoxelengine.THREE.CubeGeometry(dblScale, dblScale, dblScale);

							for (var intFor3 = 0; intFor3 < objectCube.faces.length; intFor3 += 1) {
								if (objectCube.faces[intFor3] === undefined) {
									continue;
								}

								{
									objectCube.faces[intFor3].color = new Voxel.requireVoxelengine.THREE.Color((intColor[0] << 16) + (intColor[1] << 8) + (intColor[2] << 0));
								}
							}

							for (var intFor3 = 0; intFor3 < objectCube.vertices.length; intFor3 += 1) {
								if (objectCube.vertices[intFor3] === undefined) {
									continue;
								}

								{
									objectCube.vertices[intFor3].x += dblScale * (8 - intFor1);
									objectCube.vertices[intFor3].y += dblScale * (8 - intFor2);
									objectCube.vertices[intFor3].z += 0.0;
								}
							}

							Voxel.requireVoxelengine.THREE.GeometryUtils.merge(objectEntity, objectCube);
						}
					}
				}
			}

			{
				Voxel.objectEntity[strFingerprint] = objectEntity;
			}
		}

		return new Voxel.requireVoxelengine.THREE.Mesh(Voxel.objectEntity[strFingerprint], new Voxel.requireVoxelengine.THREE.MeshBasicMaterial({
			'vertexColors': Voxel.requireVoxelengine.THREE.FaceColors
		}));
	}
};

module.exports = Voxel;
