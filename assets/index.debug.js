'use strict';

var Constants = {
    intGameLoop: 16,
    dblGameScale: 0.04,
    dblGameBlocksize: 1.0,

    intPlayerHealth: 100,
    dblPlayerMovement: [0.03, 0.18, 0.03],
    dblPlayerSize: [0.9, 1.6, 0.9],
    dblPlayerGravity: [0.0, -0.01, 0.0],
    dblPlayerMaxvel: [0.08, 0.26, 0.08],
    dblPlayerFriction: [0.8, 1.0, 0.8],
    dblPlayerHitbox: [0.4, 0.9, 0.4],
    boolPlayerFly: false,

    intInteractionPickaxeDuration: 30,
    intInteractionSwordDuration: 30,
    intInteractionSwordDamage: 20,
    dblInteractionSwordImpact: [0.11, 0.11, 0.11],
    dblInteractionSwordRange: 2.0,
    intInteractionBowDuration: 30,
    intInteractionBowDamage: 20,
    dblInteractionBowImpact: [0.11, 0.11, 0.11],

    dblFlagSize: [1.0, 1.0, 1.0],
    dblFlagGravity: [0.0, -0.01, 0.0],
    dblFlagMaxvel: [0.08, 0.26, 0.08],
    dblFlagFriction: [0.8, 1.0, 0.8],
    dblFlagRotate: 0.02,

    dblArrowSize: [0.3, 0.3, 0.3],
    dblArrowGravity: [0.0, -0.001, 0.0],
    dblArrowMaxvel: [0.36],
    dblArrowFriction: [1.0, 1.0, 1.0]
};

require('buffer');

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
var Item = require('./libItem.js');
var Muse = require('./libMuse.js');

{
    var objectBrowserify = {
        'Constants': Constants,
        'Voxel': Voxel,
        'Physics': Physics,
        'Input': Input,
        'World': World,
        'Player': Player,
        'Item': Item,
        'Muse': Muse
    };

    World.browserify(objectBrowserify);
    Player.browserify(objectBrowserify);
    Item.browserify(objectBrowserify);
}

var Gui = {
    strMode: '',

    strChooserCategory: '',
    intChooserType: '',

    strFingerprint: '',

    init: function() {
        {
            Gui.strMode = 'modeLogin';
        }

        {
            Gui.strChooserCategory = '';

            Gui.intChooserType = 0;
        }

        {
            Gui.strFingerprint = '';
        }

        {
            jQuery('#idMessagebox_Chat')
                .off('keyup')
                .on('keyup', function(objectEvent) {
                    if (objectEvent.keyCode !== 13) {
                        return;
                    }

                    {
                        Socket.objectSocket.emit('eventChat', {
                            'strMessage': jQuery('#idMessagebox_Chat').val()
                        });
                    }

                    {
                        jQuery('#idMessagebox_Chat')
                            .val('');
                    }
                });
        }

        {
            jQuery('#idLogin_Team').find('option').eq(Math.round(Math.random()))
                .prop({
                    'selected': true
                });
        }

        {
            jQuery('#idLogin_Login')
                .off('click')
                .on('click', function() {
                    {
                        Gui.updateMode('modeLoading');
                    }

                    {
                        Socket.objectSocket.emit('eventLogin', {
                            'strName': jQuery('#idLogin_Name').val(),
                            'strTeam': jQuery('#idLogin_Team').val()
                        });
                    }
                });;
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
                    });

                jQuery('#idHealth')
                    .css({
                        'display': 'none'
                    });

                jQuery('#idWestside')
                    .css({
                        'display': 'none'
                    });

                jQuery('#idEastside')
                    .css({
                        'display': 'none'
                    });

                jQuery('#idToolbar')
                    .css({
                        'display': 'none'
                    });

                jQuery('#idLoading')
                    .css({
                        'display': 'none'
                    });

                jQuery('#idLogin')
                    .css({
                        'display': 'none'
                    });
            }

            {
                if (Gui.strMode === 'modeLogin') {
                    jQuery('#idLogin')
                        .css({
                            'display': 'block'
                        });

                } else if (Gui.strMode === 'modeLoading') {
                    jQuery('#idLoading')
                        .css({
                            'display': 'block'
                        });

                } else if (Gui.strMode === 'modeMenu') {
                    jQuery('#idWestside')
                        .css({
                            'display': 'block'
                        });

                    jQuery('#idEastside')
                        .css({
                            'display': 'block'
                        });

                } else if (Gui.strMode === 'modeGame') {
                    jQuery('#idCrosshair')
                        .css({
                            'display': 'block'
                        });

                    jQuery('#idHealth')
                        .css({
                            'display': 'block'
                        });

                    jQuery('#idToolbar')
                        .css({
                            'display': 'block'
                        });

                }
            }
        }

        {
            {
                jQuery('#idPhaseBuild').find('a')
                    .removeClass('btn-primary');

                jQuery('#idPhaseCombat').find('a')
                    .removeClass('btn-primary');
            }

            {
                if (Gui.strChooserCategory === 'categoryCreate') {
                    jQuery('#idPhaseBuild').find('a').eq(Gui.intChooserType + 0)
                        .addClass('btn-primary');

                } else if (Gui.strChooserCategory === 'categoryDestroy') {
                    jQuery('#idPhaseBuild').find('a').eq(Gui.intChooserType + 1)
                        .addClass('btn-primary');

                } else if (Gui.strChooserCategory === 'categoryWeapon') {
                    jQuery('#idPhaseCombat').find('a').eq(Gui.intChooserType + 0)
                        .addClass('btn-primary');

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

            } else if (Gui.strChooserCategory === 'categoryDestroy') {
                Player.objectPlayer['1'].strEntity = 'entityPickaxe';

            } else if (Gui.strChooserCategory === 'categoryWeapon') {
                if (Gui.intChooserType === 0) {
                    Player.objectPlayer['1'].strEntity = 'entitySword';

                } else if (Gui.intChooserType === 1) {
                    Player.objectPlayer['1'].strEntity = 'entityBow';

                }

            }
        }

        {
            Socket.objectSocket.emit('eventPlayerEntity', {
                'strEntity': Player.objectPlayer['1'].strEntity
            });
        }

        {
            Gui.update();
        }
    }
};

var Socket = {
    objectSocket: null,

    intPing: 0,

    init: function() {
        {
            Socket.objectSocket = null;
        }

        {
            Socket.intPing = 0;
        }

        {
            jQuery.getScript('/socket.io/socket.io.js', function() {
                Socket.objectSocket = io({
                    'reconnection': true,
                    'reconnectionDelay': 1000,
                    'reconnectionDelayMax': 5000,
                    'timeout': 5000,
                    'transports': ['websocket']
                });

                {
                    Socket.objectSocket.io.engine.on('open', function() {
                        {
                            Socket.objectSocket.strIdent = Socket.objectSocket.io.engine.id.substr(0, 8);
                        }
                    });

                    Socket.objectSocket.on('eventLogin', function(objectData) {
                        {
                            if (objectData.strType === 'typeReject') {
                                {
                                    Gui.updateMode('modeLogin');
                                }

                                {
                                    if (objectData.strMessage === '') {
                                        jQuery('#idLogin_Message')
                                            .css({
                                                'display': 'none'
                                            })
                                            .text(objectData.strMessage);

                                    } else if (objectData.strMessage !== '') {
                                        jQuery('#idLogin_Message')
                                            .css({
                                                'display': 'block'
                                            })
                                            .text(objectData.strMessage);

                                    }
                                }

                            } else if (objectData.strType === 'typeAccept') {
                                {
                                    Gui.updateMode('modeMenu');
                                }
                            }
                        }
                    });

                    Socket.objectSocket.on('eventPing', function(objectData) {
                        {
                            jQuery('#idHealth').children('div')
                                .css({
                                    'left': (0.5 * (100 - Player.objectPlayer['1'].intHealth)) + '%',
                                    'right': (0.5 * (100 - Player.objectPlayer['1'].intHealth)) + '%'
                                });
                        }

                        {
                            jQuery('#idServer_Ping')
                                .text(new Date().getTime() - Socket.intPing);

                            jQuery('#idServer_Phase')
                                .html(objectData.strPhaseActive + '<div style="padding:5px 0px 0px 0px; font-size:10px;">with ' + Math.floor(objectData.intPhaseRemaining / 1000) + ' seconds remainin and ' + objectData.intPhaseRound + ' rounds left</div>');

                            jQuery('#idServer_World')
                                .text(objectData.strWorldActive);

                            jQuery('#idServer_Players')
                                .text(objectData.intPlayerActive + ' / ' + objectData.intPlayerCapacity);

                            jQuery('#idTeamRed_Score')
                                .text(objectData.intScoreRed);

                            jQuery('#idTeamBlue_Score')
                                .text(objectData.intScoreBlue);
                        }

                        {
                            jQuery('#idTeamRed_Table').find('tbody')
                                .empty();

                            jQuery('#idTeamBlue_Table').find('tbody')
                                .empty();
                        }

                        {
                            for (var strIdent in Player.objectPlayer) {
                                var objectPlayer = Player.objectPlayer[strIdent];

                                {
                                    var strIdent = '';

                                    if (objectPlayer.strTeam === 'teamRed') {
                                        strIdent = '#idTeamRed_Table';

                                    } else if (objectPlayer.strTeam === 'teamBlue') {
                                        strIdent = '#idTeamBlue_Table';

                                    }

                                    jQuery(strIdent).find('tbody')
                                        .append(jQuery('<tr></tr>')
                                            .append(jQuery('<td></td>')
                                                .text(objectPlayer.strName)
                                            )
                                            .append(jQuery('<td></td>')
                                                .text(objectPlayer.intScore)
                                            )
                                            .append(jQuery('<td></td>')
                                                .text(objectPlayer.intKills)
                                            )
                                            .append(jQuery('<td></td>')
                                                .text(objectPlayer.intDeaths)
                                            )
                                        );
                                }
                            }
                        }

                        {
                            jQuery('#idTeamRed_Players')
                                .text(jQuery('#idTeamRed_Table').find('tbody').find('tr').length);

                            jQuery('#idTeamBlue_Players')
                                .text(jQuery('#idTeamBlue_Table').find('tbody').find('tr').length);
                        }

                        {
                            {
                                jQuery('#idPhaseBuild')
                                    .css({
                                        'display': 'none'
                                    });

                                jQuery('#idPhaseCombat')
                                    .css({
                                        'display': 'none'
                                    });
                            }

                            {
                                if (objectData.strPhaseActive === 'Build') {
                                    jQuery('#idPhaseBuild')
                                        .css({
                                            'display': 'block'
                                        });

                                } else if (objectData.strPhaseActive === 'Combat') {
                                    jQuery('#idPhaseCombat')
                                        .css({
                                            'display': 'block'
                                        });

                                }
                            }
                        }
                    });

                    var meshes = [];

                    Socket.objectSocket.on('addMesh', function(objectData) {
                        if (meshes[objectData.id] !== undefined) return;
                        var geometry = new Voxel.requireVoxelengine.THREE.CubeGeometry(objectData.size[0], objectData.size[1], objectData.size[2]);
                        var material = new Voxel.requireVoxelengine.THREE.MeshBasicMaterial(objectData.Material);
                        var mesh = new Voxel.requireVoxelengine.THREE.Mesh(geometry, material);
                        mesh.position.set(objectData.position[0], objectData.position[1], objectData.position[2]);
                        mesh.rotation.set(objectData.rotation[0], objectData.rotation[1], objectData.rotation[2]);
                        Voxel.requireVoxelengine.scene.add(mesh);
                        meshes[objectData.id] = mesh;
                    });

                    Socket.objectSocket.on('addDrone', function(objectData) {
                        if (meshes[objectData.id] !== undefined) return;
                        var materialArray = [];
                        var xplus = Voxel.requireVoxelengine.THREE.ImageUtils.loadTexture('images/drone/' + objectData.type + '-side.png');
                        var xminus = Voxel.requireVoxelengine.THREE.ImageUtils.loadTexture('images/drone/' + objectData.type + '-side.png');
                        var yplus = Voxel.requireVoxelengine.THREE.ImageUtils.loadTexture('images/drone/' + objectData.type + '-top.png');
                        var yminus = Voxel.requireVoxelengine.THREE.ImageUtils.loadTexture('images/drone/' + objectData.type + '-bottom.png');
                        var zplus = Voxel.requireVoxelengine.THREE.ImageUtils.loadTexture('images/drone/' + objectData.type + '-side.png');
                        var zminus = Voxel.requireVoxelengine.THREE.ImageUtils.loadTexture('images/drone/' + objectData.type + '-side.png');
                        materialArray.push(new Voxel.requireVoxelengine.THREE.MeshBasicMaterial({
                            map: xplus
                        }));
                        materialArray.push(new Voxel.requireVoxelengine.THREE.MeshBasicMaterial({
                            map: xminus
                        }));
                        materialArray.push(new Voxel.requireVoxelengine.THREE.MeshBasicMaterial({
                            map: yplus
                        }));
                        materialArray.push(new Voxel.requireVoxelengine.THREE.MeshBasicMaterial({
                            map: yminus
                        }));
                        materialArray.push(new Voxel.requireVoxelengine.THREE.MeshBasicMaterial({
                            map: zplus
                        }));
                        materialArray.push(new Voxel.requireVoxelengine.THREE.MeshBasicMaterial({
                            map: zminus
                        }));
                        var material = new Voxel.requireVoxelengine.THREE.MeshFaceMaterial(materialArray);
                        var geometry = new Voxel.requireVoxelengine.THREE.CubeGeometry(1, 1/6, 1, undefined, undefined, undefined, materialArray);
                        var mesh = new Voxel.requireVoxelengine.THREE.Mesh(geometry, material);
                        mesh.position.set(objectData.position[0], objectData.position[1], objectData.position[2]);
                        mesh.rotation.set(objectData.rotation[0], objectData.rotation[1], objectData.rotation[2]);
                        Voxel.requireVoxelengine.scene.add(mesh);
                        meshes[objectData.id] = mesh;
                    });

                    Socket.objectSocket.on('updateMesh', function(objectData) {
                        if (meshes[objectData.id] === undefined) return;
                        Voxel.requireVoxelengine.scene.remove(meshes[objectData.id]);
                        var geometry = new Voxel.requireVoxelengine.THREE.CubeGeometry(objectData.size[0], objectData.size[1], objectData.size[2]);
                        var material = new Voxel.requireVoxelengine.THREE.MeshBasicMaterial(objectData.Material);
                        var mesh = new Voxel.requireVoxelengine.THREE.Mesh(geometry, material);
                        mesh.position.set(objectData.position[0], objectData.position[1], objectData.position[2]);
                        mesh.rotation.set(objectData.rotation[0], objectData.rotation[1], objectData.rotation[2]);
                        Voxel.requireVoxelengine.scene.add(mesh);
                        meshes[objectData.id] = mesh;
                    });

                    Socket.objectSocket.on('removeMesh', function(objectData) {
                        if (meshes[objectData.id] === undefined) return;
                        Voxel.requireVoxelengine.scene.remove(meshes[objectData.id]);
                        meshes[objectData.id] = undefined;
                    });

                    Socket.objectSocket.on('moveMesh', function(objectData) {
                        if (meshes[objectData.id] === undefined) return;
                        var nownum = 0;
                        var now;
                        var time;
                        var moveX;
                        var moveY;
                        var moveZ;
                        if (objectData.moves[nownum].type === "move") {
                            now = [meshes[objectData.id].position.x, meshes[objectData.id].position.y, meshes[objectData.id].position.z];
                            time = objectData.time;
                            moveX = objectData.moves[nownum].position[0] - now[0];
                            moveY = objectData.moves[nownum].position[1] - now[1];
                            moveZ = objectData.moves[nownum].position[2] - now[2];
                        } else if (objectData.moves[nownum].type === "rotate") {
                            now = [meshes[objectData.id].rotation.x, meshes[objectData.id].rotation.y, meshes[objectData.id].rotation.z];
                            time = objectData.rotatetime;
                            moveY = objectData.moves[nownum].rotation;
                        }
                        var estimated = 0;
                        var move = function() {
                            estimated += 25;
                            if (estimated > time) {
                                if (objectData.moves[nownum].type === "move") {
                                    now = [meshes[objectData.id].position.x + moveX, meshes[objectData.id].position.y + moveY, meshes[objectData.id].position.z + moveZ];
                                } else if (objectData.moves[nownum].type === "rotate") {
                                    now = [meshes[objectData.id].rotation.x, meshes[objectData.id].rotation.y + moveY, meshes[objectData.id].rotation.z];
                                }
                                nownum++;
                                if (objectData.moves[nownum] === undefined) {
                                    clearInterval(interval);
                                    return;
                                }
                                if (objectData.moves[nownum].type === "move") {
                                    now = [meshes[objectData.id].position.x, meshes[objectData.id].position.y, meshes[objectData.id].position.z];
                                    time = objectData.time;
                                    moveX = objectData.moves[nownum].position[0] - now[0];
                                    moveY = objectData.moves[nownum].position[1] - now[1];
                                    moveZ = objectData.moves[nownum].position[2] - now[2];
                                } else if (objectData.moves[nownum].type === "rotate") {
                                    now = [meshes[objectData.id].rotation.x, meshes[objectData.id].rotation.y, meshes[objectData.id].rotation.z];
                                    time = objectData.rotatetime;
                                    moveY = objectData.moves[nownum].rotation;
                                }
                                estimated = 0;
                            }
                            Voxel.requireVoxelengine.scene.remove(meshes[objectData.id]);
                            if (objectData.moves[nownum].type === "move") {
                                meshes[objectData.id].position.set(now[0] + moveX * Math.floor(estimated / time * 100) / 100, now[1] + moveY * Math.floor(estimated / time * 100) / 100, now[2] + moveZ * Math.floor(estimated / time * 100) / 100);
                            } else if (objectData.moves[nownum].type === "rotate") {
                                meshes[objectData.id].rotation.set(now[0], now[1] + moveY * Math.floor(estimated / time * 100) / 100, now[2]);
                            }
                            Voxel.requireVoxelengine.scene.add(meshes[objectData.id]);
                        };
                        var interval = setInterval(move, 25);
                    });

                    Socket.objectSocket.on('kick', function(objectData) {
                        alert(objectData.strMessage);
                        location.reload();
                    });

                    Socket.objectSocket.on('setfov', function(objectData) {
                        Voxel.requireVoxelengine.view.camera.fov = objectData.fov;
                        Voxel.requireVoxelengine.view.camera.updateProjectionMatrix();
                    });

                    Socket.objectSocket.on('showTipMessage', function(objectData) {
                        if (objectData.strReceiver === undefined || objectData.strReceiver === Player.objectPlayer['1'].strName)
                            jQuery('#idTipMessage').text(objectData.strText);
                    });

                    Socket.objectSocket.on('eventChat', function(objectData) {
                        var Name = objectData.strName;
                        if (Name != "") Name = Name + ": "; {

                            jQuery('#idMessagebox_Log')
                                .append(jQuery('<div></div>')
                                    .append(jQuery('<span></span>')
                                        .css({
                                            'font-weight': 'bold'
                                        })
                                        .text(Name)
                                    )
                                    .append(jQuery('<span></span>')
                                        .text(objectData.strMessage)
                                    )
                                );

                            jQuery('#idMessagebox_Log')
                                .scrollTop(jQuery('#idMessagebox_Log').get(0).scrollHeight - jQuery('#idMessagebox_Log').height());
                        }
                    });

                    Socket.objectSocket.on('eventWorld', function(objectData) {
                        {
                            World.loadBuffer(null, objectData.strBuffer);
                        }
                    });

                    Socket.objectSocket.on('eventWorldCreate', function(objectData) {
                        {
                            World.updateCreate(objectData.intCoordinate, objectData.strType, objectData.boolBlocked);
                        }
                    });

                    Socket.objectSocket.on('eventWorldDestroy', function(objectData) {
                        {
                            World.updateDestroy(objectData.intCoordinate);
                        }
                    });

                    Socket.objectSocket.on('eventPlayer', function(objectData) {
                        {
                            var objectOverwrite = {};

                            try {
                                Player.loadBuffer(objectOverwrite, objectData.strBuffer);
                            } catch (objectError) {
                                objectOverwrite = {};
                            }

                            {
                                if (objectOverwrite[Socket.objectSocket.strIdent] !== undefined) {
                                    Player.objectPlayer['1'].strTeam = objectOverwrite[Socket.objectSocket.strIdent].strTeam;
                                    Player.objectPlayer['1'].strEntity = objectOverwrite[Socket.objectSocket.strIdent].strEntity;
                                    Player.objectPlayer['1'].strName = objectOverwrite[Socket.objectSocket.strIdent].strName;
                                    Player.objectPlayer['1'].dblPosition = objectOverwrite[Socket.objectSocket.strIdent].dblPosition;
                                    Player.objectPlayer['1'].dblGravity = objectOverwrite[Socket.objectSocket.strIdent].dblGravity;
                                    Player.objectPlayer['1'].dblAcceleration = objectOverwrite[Socket.objectSocket.strIdent].dblAcceleration;
                                    Player.objectPlayer['1'].dblVerlet = objectOverwrite[Socket.objectSocket.strIdent].dblVerlet;
                                    Player.objectPlayer['1'].intScore = objectOverwrite[Socket.objectSocket.strIdent].intScore;
                                    Player.objectPlayer['1'].intKills = objectOverwrite[Socket.objectSocket.strIdent].intKills;
                                    Player.objectPlayer['1'].intDeaths = objectOverwrite[Socket.objectSocket.strIdent].intDeaths;
                                    Player.objectPlayer['1'].intHealth = objectOverwrite[Socket.objectSocket.strIdent].intHealth;
                                    Player.objectPlayer['1'].boolFly = objectOverwrite[Socket.objectSocket.strIdent].boolFly;
                                }
                            }

                            {
                                delete objectOverwrite[Socket.objectSocket.strIdent];
                            }

                            {
                                for (var strIdent in Player.objectPlayer) {
                                    if (strIdent !== '1') {
                                        if (objectOverwrite[strIdent] === undefined) {
                                            delete Player.objectPlayer[strIdent];
                                        }
                                    }
                                }
                            }

                            {
                                for (var strIdent in objectOverwrite) {
                                    if (Player.objectPlayer[strIdent] === undefined) {
                                        Player.objectPlayer[strIdent] = {};
                                    }

                                    var objectTo = Player.objectPlayer[strIdent]
                                    var objectFrom = objectOverwrite[strIdent];

                                    objectTo.strIdent = objectFrom.strIdent;
                                    objectTo.strTeam = objectFrom.strTeam;
                                    objectTo.strEntity = objectFrom.strEntity;
                                    objectTo.strName = objectFrom.strName;
                                    objectTo.intScore = objectFrom.intScore;
                                    objectTo.intKills = objectFrom.intKills;
                                    objectTo.intDeaths = objectFrom.intDeaths;
                                    objectTo.intHealth = objectFrom.intHealth;
                                    objectTo.dblPosition = objectTo.dblPosition || objectFrom.dblPosition;
                                    objectTo.dblVerlet = objectTo.dblVerlet || objectFrom.dblVerlet;
                                    objectTo.dblAcceleration = objectTo.dblAcceleration || objectFrom.dblAcceleration;
                                    objectTo.dblRotation = objectFrom.dblRotation;
                                    objectTo.intJumpcount = objectFrom.intJumpcount;
                                    objectTo.intWalk = objectTo.intWalk || objectFrom.intWalk;
                                    objectTo.intWeapon = objectFrom.intWeapon;

                                    Physics.updateOverwrite(objectTo, objectFrom);
                                }
                            }
                        }
                    });

                    Socket.objectSocket.on('eventPlayerRespawn', function(objectData) {
                        {
                            Player.objectPlayer['1'].dblPosition[0] = objectData.dblPosition[0];
                            Player.objectPlayer['1'].dblPosition[1] = objectData.dblPosition[1];
                            Player.objectPlayer['1'].dblPosition[2] = objectData.dblPosition[2];

                            Player.objectPlayer['1'].dblVerlet[0] = objectData.dblVerlet[0];
                            Player.objectPlayer['1'].dblVerlet[1] = objectData.dblVerlet[1];
                            Player.objectPlayer['1'].dblVerlet[2] = objectData.dblVerlet[2];
                        }

                        {
                            Gui.updateChooser('', 0);
                        }
                    });

                    Socket.objectSocket.on('eventPlayerHit', function(objectData) {
                        {
                            Player.objectPlayer['1'].dblAcceleration[0] = objectData.dblAcceleration[0];
                            Player.objectPlayer['1'].dblAcceleration[1] = objectData.dblAcceleration[1];
                            Player.objectPlayer['1'].dblAcceleration[2] = objectData.dblAcceleration[2];
                        }
                    });

                    Socket.objectSocket.on('eventItem', function(objectData) {
                        {
                            var objectOverwrite = {};

                            try {
                                Item.loadBuffer(objectOverwrite, objectData.strBuffer);
                            } catch (objectError) {
                                objectOverwrite = {};
                            }

                            {
                                for (var strIdent in Item.objectItem) {
                                    if (objectOverwrite[strIdent] === undefined) {
                                        delete Item.objectItem[strIdent];
                                    }
                                }
                            }

                            {
                                for (var strIdent in objectOverwrite) {
                                    if (Item.objectItem[strIdent] === undefined) {
                                        Item.objectItem[strIdent] = {};
                                    }

                                    var objectTo = Item.objectItem[strIdent]
                                    var objectFrom = objectOverwrite[strIdent];

                                    objectTo.strIdent = objectFrom.strIdent;
                                    objectTo.strPlayer = objectFrom.strPlayer;
                                    objectTo.dblPosition = objectTo.dblPosition || objectFrom.dblPosition;
                                    objectTo.dblVerlet = objectTo.dblVerlet || objectFrom.dblVerlet;
                                    objectTo.dblAcceleration = objectTo.dblAcceleration || objectFrom.dblAcceleration;
                                    objectTo.dblRotation = objectFrom.dblRotation;

                                    Physics.updateOverwrite(objectTo, objectFrom);
                                }
                            }
                        }
                    });
                }

                {
                    var functionInterval = function() {
                        {
                            Socket.intPing = new Date().getTime();
                        }

                        {
                            Socket.objectSocket.emit('eventPing', {
                                'intTimestamp': new Date().getTime()
                            });
                        }
                    };

                    window.setInterval(functionInterval, 1000);
                }
            });
        }
    },

    dispel: function() {
        {
            Socket.objectSocket = null;
        }

        {
            Socket.intPing = 0;
        }
    }
};

window.addEventListener('load', function() {
    {
        Voxel.init(function(intCoordinateX, intCoordinateY, intCoordinateZ) {
            return 0;
        });

        Voxel.requireVoxelengine.on('fire', function(objectTarget, objectState) {
            if (Gui.strChooserCategory === 'categoryCreate') {
                if (Voxel.requireVoxelhighlight.intCreate === null) {
                    return;
                }

                if (Gui.intChooserType === 0) {
                    if (Player.objectPlayer['1'].intWeapon > 0) {
                        return;
                    }

                    {
                        Player.objectPlayer['1'].intWeapon = Constants.intInteractionPickaxeDuration;
                    }

                    {
                        Socket.objectSocket.emit('eventWorldCreate', {
                            'intCoordinate': Voxel.requireVoxelhighlight.intCreate,
                            'strType': 'voxelDirt',
                            'boolBlocked': false
                        });
                    }
                }

            } else if (Gui.strChooserCategory === 'categoryDestroy') {
                if (Voxel.requireVoxelhighlight.intDestroy === null) {
                    return;
                }

                if (Gui.intChooserType === 0) {
                    if (Player.objectPlayer['1'].intWeapon > 0) {
                        return;
                    }

                    {
                        Player.objectPlayer['1'].intWeapon = Constants.intInteractionPickaxeDuration;
                    }

                    {
                        Socket.objectSocket.emit('eventWorldDestroy', {
                            'intCoordinate': Voxel.requireVoxelhighlight.intDestroy
                        });
                    }
                }

            } else if (Gui.strChooserCategory === 'categoryWeapon') {
                if (Gui.intChooserType === 0) {
                    if (Player.objectPlayer['1'].intWeapon > 0) {
                        return;
                    }

                    {
                        Player.objectPlayer['1'].intWeapon = Constants.intInteractionSwordDuration;
                    }

                    {
                        Socket.objectSocket.emit('eventPlayerWeapon', {
                            'strWeapon': 'weaponSword'
                        });
                    }

                } else if (Gui.intChooserType === 1) {
                    if (Player.objectPlayer['1'].intWeapon > 0) {
                        return;
                    }

                    {
                        Player.objectPlayer['1'].intWeapon = Constants.intInteractionBowDuration;
                    }

                    {
                        Socket.objectSocket.emit('eventPlayerWeapon', {
                            'strWeapon': 'weaponBow'
                        });
                    }

                }

            }
        });

        Voxel.requireVoxelengine.on('tick', function(intDelta) {
            if (Gui.strMode === 'modeLogin') {
                return;

            } else if (Socket.objectSocket === null) {
                return;
            }

            {
                Input.update();
            }

            {
                var multiplier = 1;
                if (Player.objectPlayer['1'].boolFly) multiplier = 2;
                if (Input.boolUp === true) {
                    Player.objectPlayer['1'].dblAcceleration[0] -= Constants.dblPlayerMovement[0] * Math.sin(Player.objectPlayer['1'].dblRotation[1]) * multiplier;
                    Player.objectPlayer['1'].dblAcceleration[1] -= 0.0;
                    Player.objectPlayer['1'].dblAcceleration[2] -= Constants.dblPlayerMovement[0] * Math.cos(Player.objectPlayer['1'].dblRotation[1]) * multiplier;
                }

                if (Input.boolDown === true) {
                    Player.objectPlayer['1'].dblAcceleration[0] += Constants.dblPlayerMovement[0] * Math.sin(Player.objectPlayer['1'].dblRotation[1]) * multiplier;
                    Player.objectPlayer['1'].dblAcceleration[1] += 0.0;
                    Player.objectPlayer['1'].dblAcceleration[2] += Constants.dblPlayerMovement[0] * Math.cos(Player.objectPlayer['1'].dblRotation[1]) * multiplier;
                }

                if (Input.boolLeft === true) {
                    Player.objectPlayer['1'].dblAcceleration[0] -= Constants.dblPlayerMovement[2] * Math.sin(Player.objectPlayer['1'].dblRotation[1] + (0.5 * Math.PI)) * multiplier;
                    Player.objectPlayer['1'].dblAcceleration[1] -= 0.0;
                    Player.objectPlayer['1'].dblAcceleration[2] -= Constants.dblPlayerMovement[2] * Math.cos(Player.objectPlayer['1'].dblRotation[1] + (0.5 * Math.PI)) * multiplier;
                }

                if (Input.boolRight === true) {
                    Player.objectPlayer['1'].dblAcceleration[0] += Constants.dblPlayerMovement[2] * Math.sin(Player.objectPlayer['1'].dblRotation[1] + (0.5 * Math.PI)) * multiplier;
                    Player.objectPlayer['1'].dblAcceleration[1] += 0.0;
                    Player.objectPlayer['1'].dblAcceleration[2] += Constants.dblPlayerMovement[2] * Math.cos(Player.objectPlayer['1'].dblRotation[1] + (0.5 * Math.PI)) * multiplier;
                }

                if (Input.boolSpace === true) {
                    if (Player.objectPlayer['1'].intJumpcount > 0 || Player.objectPlayer['1'].boolFly) {
                        {
                            Player.objectPlayer['1'].dblAcceleration[0] += 0.0;
                            Player.objectPlayer['1'].dblAcceleration[1] += Constants.dblPlayerMovement[1];
                            Player.objectPlayer['1'].dblAcceleration[2] += 0.0;
                        }
                        if (!Player.objectPlayer['1'].boolFly) {
                            Player.objectPlayer['1'].intJumpcount -= 1;
                        }
                    }
                }

                if (Input.boolShift === true) {
                    Player.objectPlayer['1'].dblAcceleration[0] += 0.0;
                    Player.objectPlayer['1'].dblAcceleration[1] -= Constants.dblPlayerMovement[1];
                    Player.objectPlayer['1'].dblAcceleration[2] += 0.0;
                }

                if (Input.boolSpace === false && Input.boolShift === false && Player.objectPlayer['1'].boolFly) {
                    Player.objectPlayer['1'].dblAcceleration[1] = 0;
                    Player.objectPlayer['1'].dblVerlet[1] = Player.objectPlayer['1'].dblPosition[1];
                }
            }

            {
                World.update();
            }

            {
                Player.update();
            }

            {
                Item.update();
            }

            {
                Gui.update();
            }

            {
                Socket.objectSocket.emit('eventPlayer', {
                    'strBuffer': Player.saveBuffer({
                        '1': Player.objectPlayer['1']
                    })
                });
            }
        });

        Voxel.requireVoxelhighlight.enabled = function() {
            if (Gui.strChooserCategory === 'categoryCreate') {
                return true;

            } else if (Gui.strChooserCategory === 'categoryDestroy') {
                return true;

            }

            return false;
        };

        Voxel.requireVoxelhighlight.adjacentActive = function() {
            if (Gui.strChooserCategory === 'categoryCreate') {
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
            if (jQuery('#idMessagebox_Chat').get(0) === window.document.activeElement) {
                return true;

            } else if (jQuery('#idLogin_Name').get(0) === window.document.activeElement) {
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
                        Gui.updateChooser('categoryCreate', 0);

                    } else if (objectEvent.keyCode === 50) {
                        Gui.updateChooser('categoryDestroy', 0);

                    }

                } else if (jQuery('#idPhaseCombat').css('display') === 'block') {
                    if (objectEvent.keyCode === 49) {
                        Gui.updateChooser('categoryWeapon', 0);

                    } else if (objectEvent.keyCode === 50) {
                        Gui.updateChooser('categoryWeapon', 1);

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
        Item.init();

        Item.functionFlagInit = function(objectItem) {

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

            {
                if (objectItem.strPlayer === Socket.objectSocket.strIdent) {
                    objectItem.dblPosition[0] = Player.objectPlayer['1'].dblPosition[0];
                    objectItem.dblPosition[1] = Player.objectPlayer['1'].dblPosition[1] + 1.0;
                    objectItem.dblPosition[2] = Player.objectPlayer['1'].dblPosition[2];

                    objectItem.dblVerlet[0] = objectItem.dblPosition[0];
                    objectItem.dblVerlet[1] = objectItem.dblPosition[1];
                    objectItem.dblVerlet[2] = objectItem.dblPosition[2];
                }
            }
        };
    }

    {
        Gui.init();
    }

    {
        Socket.init();
    }
}, false);
