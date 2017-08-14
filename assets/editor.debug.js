'use strict';

var Constants = {
	intGameLoop: 16,
	dblGameScale: 0.04,
	dblGameBlocksize: 1.0,
	
	intPlayerHealth: 100,
	dblPlayerMovement: [ 0.03, 0.03, 0.03 ],
	dblPlayerSize: [ 0.9, 1.6, 0.9 ],
	dblPlayerGravity: [ 0.0, 0.0, 0.0 ],
	dblPlayerMaxvel: [ 0.12, 0.26, 0.12 ],
	dblPlayerFriction: [ 0.8, 0.8, 0.8 ],
	dblPlayerHitbox: [ 0.4, 0.9, 0.4 ]
};

var Voxel = require('./libVoxel.js');
var Physics = require('./libPhysics.js');
var Input = require('./libInput.js');

{
	var objectBrowserify = {
		'Constants': Constants,
		'Voxel': Voxel,
		'Physics': Physics,
		'Input': Input
	};

	Voxel.browserify(objectBrowserify);
	Physics.browserify(objectBrowserify);
	Input.browserify(objectBrowserify);
}

var World = require('./libWorld.js');
var Player = require('./libPlayer.js');

{
	var objectBrowserify = {
		'Constants': Constants,
		'Voxel': Voxel,
		'Physics': Physics,
		'Input': Input,
		'World': World,
		'Player': Player
	};

	World.browserify(objectBrowserify);
	Player.browserify(objectBrowserify);
}

var Gui = {
	strMode: '',
	
	strChooserCategory: '',
	intChooserType: '',
	
	strFingerprint: '',
	
	init: function() {
		{
			Gui.strMode = 'modeMenu';
		}
		
		{
			Gui.strChooserCategory = '';
			
			Gui.intChooserType = 0;
		}
		
		{
			Gui.strFingerprint = '';
		}
		
		{
			jQuery('#idWorld_Save')
				.off('click')
				.on('click', function() {
					{
						jQuery('#idWorld_Json')
							.val(World.saveBuffer(null))
						;
					}
				})
			;
		}
		
		{
			jQuery('#idWorld_Load')
				.off('click')
				.on('click', function() {
					{
						World.loadBuffer(null, jQuery('#idWorld_Json').val());
					}
				})
			;
		}
	},
	
	dispel: function() {
		{
			Gui.strMode = '';
		}
		
		{
			Gui.strChooserCategory = '';
			
			Gui.intChooserType = 0;
		}
		
		{
			Gui.strFingerprint = '';
		}
	},
	
	update: function() {
		{
			var strFingerprint = '';
			
			strFingerprint += Gui.strMode + ';';
			strFingerprint += Gui.strChooserCategory + ';';
			strFingerprint += Gui.intChooserType + ';';
			
			if (strFingerprint === Gui.strFingerprint) {
				return;
			}
			
			Gui.strFingerprint = strFingerprint;
		}
		
		{
			{
				jQuery('#idCrosshair')
					.css({
						'display': 'none'
					})
				;
				
				jQuery('#idToolbar')
					.css({
						'display': 'none'
					})
				;
				
				jQuery('#idWorld')
					.css({
						'display': 'none'
					})
				;
			}
			
			{
				if (Gui.strMode === 'modeMenu') {
					jQuery('#idWorld')
						.css({
							'display': 'block'
						})
					;
					
				} else if (Gui.strMode === 'modeGame') {
					jQuery('#idCrosshair')
						.css({
							'display': 'block'
						})
					;
					
					jQuery('#idToolbar')
						.css({
							'display': 'block'
						})
					;
					
				}
			}
		}
		
		{
			{
				jQuery('#idPhaseBuild').find('select')
					.removeClass('btn-primary')
				;
				
				jQuery('#idPhaseBuild').find('a')
					.removeClass('btn-primary')
				;
			}
			
			{
				if (Gui.strChooserCategory === 'categoryCreate') {
					jQuery('#idPhaseBuild').find('select').eq(0)
						.addClass('btn-primary')
					;
					
					jQuery('#idPhaseBuild').find('select').eq(0).find('option').eq(Gui.intChooserType + 0)
						.prop({
							'selected': true
						})
					;
					
				} else if (Gui.strChooserCategory === 'categorySpecial') {
					jQuery('#idPhaseBuild').find('select').eq(1)
						.addClass('btn-primary')
					;
					
					jQuery('#idPhaseBuild').find('select').eq(1).find('option').eq(Gui.intChooserType + 0)
						.prop({
							'selected': true
						})
					;
					
				} else if (Gui.strChooserCategory === 'categoryDestroy') {
					jQuery('#idPhaseBuild').find('a').eq(Gui.intChooserType + 0)
						.addClass('btn-primary')
					;
					
				}
			}
		}
	},
	
	updateMode: function(strMode) {
		{
			Gui.strMode = strMode;
		}
		
		{
			Gui.update();
		}
	},
	
	updateChooser: function(strChooserCategory, intChooserType) {
		{
			Gui.strChooserCategory = strChooserCategory;
			
			Gui.intChooserType = intChooserType;
		}
		
		{
			if (Gui.strChooserCategory === '') {
				Player.objectPlayer['1'].strEntity = '';
				
			} else if (Gui.strChooserCategory === 'categoryCreate') {
				Player.objectPlayer['1'].strEntity = 'entityPickaxe';
				
			} else if (Gui.strChooserCategory === 'categorySpecial') {
				Player.objectPlayer['1'].strEntity = 'entityPickaxe';
				
			} else if (Gui.strChooserCategory === 'categoryDestroy') {
				Player.objectPlayer['1'].strEntity = 'entityPickaxe';
				
			}
		}
		
		{
			Gui.update();
		}
	}
};

window.addEventListener('load', function () {
	{
		Voxel.init(function(intCoordinateX, intCoordinateY, intCoordinateZ) {
			if (intCoordinateY === 0) {
				return 1;
			}
			
			return 0;
		});
		
		Voxel.requireVoxelengine.on('fire', function(objectTarget, objectState) {
			if (Gui.strChooserCategory === 'categoryCreate') {
				if (Voxel.requireVoxelhighlight.intCreate === null) {
					return;
				}
				
				if (Gui.intChooserType === 0) {
					World.updateCreate(Voxel.requireVoxelhighlight.intCreate, 'voxelBrick', true);
					
				} else if (Gui.intChooserType === 1) {
					World.updateCreate(Voxel.requireVoxelhighlight.intCreate, 'voxelDirt', true);
					
				} else if (Gui.intChooserType === 2) {
					World.updateCreate(Voxel.requireVoxelhighlight.intCreate, 'voxelGrass', true);
					
				} else if (Gui.intChooserType === 3) {
					World.updateCreate(Voxel.requireVoxelhighlight.intCreate, 'voxelPlank', true);
					
				} else if (Gui.intChooserType === 4) {
					World.updateCreate(Voxel.requireVoxelhighlight.intCreate, 'voxelStone', true);
					
				}
				
			} else if (Gui.strChooserCategory === 'categorySpecial') {
				if (Voxel.requireVoxelhighlight.intCreate === null) {
					return;
				}
				
				if (Gui.intChooserType === 0) {
					World.updateCreate(Voxel.requireVoxelhighlight.intCreate, 'voxelSpawnRed', true);
					
				} else if (Gui.intChooserType === 1) {
					World.updateCreate(Voxel.requireVoxelhighlight.intCreate, 'voxelSpawnBlue', true);

				} else if (Gui.intChooserType === 2) {
					World.updateCreate(Voxel.requireVoxelhighlight.intCreate, 'voxelFlagRed', true);
					
				} else if (Gui.intChooserType === 3) {
					World.updateCreate(Voxel.requireVoxelhighlight.intCreate, 'voxelFlagBlue', true);
					
				} else if (Gui.intChooserType === 4) {
					World.updateCreate(Voxel.requireVoxelhighlight.intCreate, 'voxelSeparator', true);
					
				}
				
			} else if (Gui.strChooserCategory === 'categoryDestroy') {
				if (Voxel.requireVoxelhighlight.intDestroy === null) {
					return;
				}
				
				if (Gui.intChooserType === 0) {
					World.updateDestroy(Voxel.requireVoxelhighlight.intDestroy);
				}
				
			}
		});

		Voxel.requireVoxelengine.on('tick', function(intDelta) {
			{
				Input.update();
			}
			
			{
				if (Input.boolUp === true) {
					Player.objectPlayer['1'].dblAcceleration[0] -= Constants.dblPlayerMovement[0] * Math.sin(Player.objectPlayer['1'].dblRotation[1]);
					Player.objectPlayer['1'].dblAcceleration[1] -= 0.0;
					Player.objectPlayer['1'].dblAcceleration[2] -= Constants.dblPlayerMovement[0] * Math.cos(Player.objectPlayer['1'].dblRotation[1]);
				}
				
				if (Input.boolDown === true) {
					Player.objectPlayer['1'].dblAcceleration[0] += Constants.dblPlayerMovement[0] * Math.sin(Player.objectPlayer['1'].dblRotation[1]);
					Player.objectPlayer['1'].dblAcceleration[1] += 0.0;
					Player.objectPlayer['1'].dblAcceleration[2] += Constants.dblPlayerMovement[0] * Math.cos(Player.objectPlayer['1'].dblRotation[1]);
				}
				
				if (Input.boolLeft === true) {
					Player.objectPlayer['1'].dblAcceleration[0] -= Constants.dblPlayerMovement[2] * Math.sin(Player.objectPlayer['1'].dblRotation[1] + (0.5 * Math.PI));
					Player.objectPlayer['1'].dblAcceleration[1] -= 0.0;
					Player.objectPlayer['1'].dblAcceleration[2] -= Constants.dblPlayerMovement[2] * Math.cos(Player.objectPlayer['1'].dblRotation[1] + (0.5 * Math.PI));
				}
				
				if (Input.boolRight === true) {
					Player.objectPlayer['1'].dblAcceleration[0] += Constants.dblPlayerMovement[2] * Math.sin(Player.objectPlayer['1'].dblRotation[1] + (0.5 * Math.PI));
					Player.objectPlayer['1'].dblAcceleration[1] += 0.0;
					Player.objectPlayer['1'].dblAcceleration[2] += Constants.dblPlayerMovement[2] * Math.cos(Player.objectPlayer['1'].dblRotation[1] + (0.5 * Math.PI));
				}
				
				if (Input.boolSpace === true) {
					Player.objectPlayer['1'].dblAcceleration[0] += 0.0;
					Player.objectPlayer['1'].dblAcceleration[1] += Constants.dblPlayerMovement[1];
					Player.objectPlayer['1'].dblAcceleration[2] += 0.0;
				}
				
				if (Input.boolShift === true) {
					Player.objectPlayer['1'].dblAcceleration[0] -= 0.0;
					Player.objectPlayer['1'].dblAcceleration[1] -= Constants.dblPlayerMovement[1];
					Player.objectPlayer['1'].dblAcceleration[2] += 0.0;
				}
			}
			
			{
				World.update();
			}
			
			{
				Player.update();
			}
			
			{
				Gui.update();
			}
		});
		
		Voxel.requireVoxelhighlight.enabled = function() {
			if (Gui.strChooserCategory === 'categoryCreate') {
				return true;
				
			} else if (Gui.strChooserCategory === 'categorySpecial') {
				return true;
				
			} else if (Gui.strChooserCategory === 'categoryDestroy') {
				return true;
				
			}
			
			return false;
		};
		
		Voxel.requireVoxelhighlight.adjacentActive = function() {
			if (Gui.strChooserCategory === 'categoryCreate') {
				return true;
				
			} if (Gui.strChooserCategory === 'categorySpecial') {
				return true;
				
			}
			
			return false;
		};
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
		Input.init();
		
		Input.functionException = function() {
			if (jQuery('#idWorld_Json').get(0) === window.document.activeElement) {
				return true;
			}
			
			return false;
		};
		
		Input.functionKeydown = function(objectEvent) {
			if (Gui.strMode === 'modeMenu') {
				if (objectEvent.keyCode === 69) {
					Gui.updateMode('modeGame');
				}
				
			} else if (Gui.strMode === 'modeGame') {
				if (objectEvent.keyCode === 69) {
					Gui.updateMode('modeMenu');
				}

				if (jQuery('#idPhaseBuild').css('display') === 'block') {
					if (objectEvent.keyCode === 49) {
						if (Gui.strChooserCategory === 'categoryCreate') {
							Gui.updateChooser('categoryCreate', (Gui.intChooserType + 1) % 5);
							
						} else if (Gui.strChooserCategory !== 'categoryCreate') {
							Gui.updateChooser('categoryCreate', 0);
							
						}
						
					} else if (objectEvent.keyCode === 50) {
						if (Gui.strChooserCategory === 'categorySpecial') {
							Gui.updateChooser('categorySpecial', (Gui.intChooserType + 1) % 5);
							
						} else if (Gui.strChooserCategory !== 'categorySpecial') {
							Gui.updateChooser('categorySpecial', 0);
							
						}
						
					} else if (objectEvent.keyCode === 51) {
						Gui.updateChooser('categoryDestroy', 0);
						
					}
				}
				
			}
		};
		
		Input.functionKeyup = function(objectEvent) {
			
		};
	}
	
	{
		World.init();
	}
	
	{
		Player.init();
		
		Player.initController();
	}
	
	{
		Player.objectPlayer['1'].strTeam = 'teamRed';
		
		Player.objectPlayer['1'].dblPosition[0] = 0.0;
		Player.objectPlayer['1'].dblPosition[1] = 8.0;
		Player.objectPlayer['1'].dblPosition[2] = 0.0;
		
		Player.objectPlayer['1'].dblVerlet[0] = Player.objectPlayer['1'].dblPosition[0];
		Player.objectPlayer['1'].dblVerlet[1] = Player.objectPlayer['1'].dblPosition[1];
		Player.objectPlayer['1'].dblVerlet[2] = Player.objectPlayer['1'].dblPosition[2];
	}
	
	{
		Gui.init();
	}
}, false);