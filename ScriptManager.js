/*jslint esversion: 6*/
/** @fileoverview Script를 불러오고 관리합니다.
 * @author Scripter36(1350adwx)
 */

/** 문자열으로부터 모듈을 불러옵니다.
 * @author Scripter36(1350adwx)
 * @param {String} src 불러올 문자열
 * @param {String} filename 파일 이름 (그냥 "" 로 비워두어도 됨)
 * @return {Object} 불러와진 모둘
 */
function requireFromString(src, filename) {
    var Module = module.constructor;
    var m = new Module();
    m._compile(src, filename);
    return m.exports;
}

/**
 * 서버 관련 함수들입니다.
 * @author Scripter36(1350adwx)
 * @type {Object}
 */
var Server = {};
/**
 * Human을 정확한 이름으로 가져옵니다.
 * @author Scripter36(1350adwx)
 * @param  {String} name 정확한 이름
 * @return {Human}      Human
 */
Server.getExactPlayer = function(name) {
    for (var i in Player.objectPlayer) {
        if (Player.objectPlayer[i].strName === name) {
            return new Human().setHumanIdent(i);
        }
    }
    return;
};

/**
 * Human을 단편적인 이름으로 가져옵니다.
 * @author Scripter36(1350adwx)
 * @param  {String} name 단편적인 이름
 * @return {Human}      Human
 */
Server.getPlayer = function(name) {
    for (var i in Player.objectPlayer) {
        if (Player.objectPlayer[i].strName.indexOf(name) != -1) {
            return new Human().setHumanIdent(i);
        }
    }
    return;
};

/**
 * 모든 Human을 가져옵니다.
 * @author Scripter36(1350adwx)
 * @return {Array}      Human Array
 */
Server.getAllPlayers = function() {
    var ans = [];
    for (var i in Player.objectPlayer) {
        ans.push(new Human().setHumanIdent(i));
    }
    return ans;
};

/**
 * 메시지를 전송합니다.
 * @author Scripter36(1350adwx)
 * @param  {String} sender   보내는 사람 이름
 * @param  {String} message  보낼 내용
 */
Server.sendMessage = function(sender, message) {
    if (sender === "") info(message);
    else info(sender + ": " + message);
    Socket.objectServer.emit('eventChat', {
        'strName': sender.toString(),
        'strMessage': message.toString()
    });
};

/**
 * 블럭을 설치합니다.
 * @param {Array} position      블럭 설치 위치
 * @param {String} blockType    블럭 이름
 * @param {Boolean} boolBlocked 플레이어가 부술 수 없으면 true
 */
Server.setBlock = function(position, blockType, boolBlocked) {
    if (typeof position === 'undefined' || position.length !== 3) return;
    for (let i in position) position[i] = parseInt(position[i]);
    if (boolBlocked === undefined) boolBlocked = false;
    boolBlocked = boolBlocked === true;
    if (blockType === undefined || blockType === null) {
        World.updateDestroy(position);
        Socket.objectServer.emit("eventWorldDestroy", {
            intCoordinate: position
        });
    } else {
        World.updateCreate(position, blockType, boolBlocked);
        Socket.objectServer.emit("eventWorldCreate", {
            intCoordinate: position,
            strType: blockType,
            boolBlocked: boolBlocked
        });
    }
};


Server.getBlock = function(position) {
    var world = World.objectWorld[(position[0] << 20) + (position[1] << 10) + (position[2] << 0)];
    if (world === undefined) return;
    return world.strType;
};


Server.setPhaseRemaining = function(phase) {
    Gameserver.intPhaseRemaining = parseInt(phase);
};

Server.getPhaseRemaining = function() {
    return Gameserver.intPhaseRemaining;
};

Server.setPhaseChange = function(bool) {
    exports.isPhaseChange = bool === true;
};

Server.isPhaseChange = function() {
    return exports.isPhaseChange;
};

Server.banIP = function(ip) {
    ip = ip.split(':');
    if (ip.length !== 4) return false;
    for (var i in ip)
        if (isNaN(ip[i])) return false;
    bannedIP.push(ip.join(':'));
    writeBannedIP(bannedIP);
    return true;
};

Server.getBannedIP = function() {
    return bannedIP;
};

Server.info = function(message) {
    info(message);
}


var ChatColor = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",

    FgBlack: "\x1b[30m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",

    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m"
};


/**
 * 사람 관련 객체입니다
 * @author Scripter36(1350adwx)
 * @class
 */
function Human() {
    /** @type {String} 사람 Ident */
    this.HumanIdent = undefined;

    /**
     * 플레이어를 업데이트합니다.
     */
    this.update = function() {
        exports.sendingPlayerData = true;
        Socket.objectServer.emit('eventPlayer', {
            'strBuffer': Player.saveBuffer(null)
        });
        exports.sendingPlayerData = false;
        return this;
    };

    /**
     * Human에게만 보내는 소켓을 얻어옵니다.
     * @return {Object} 소켓
     */
    this.getSocket = function() {
        return Player.objectPlayer[this.HumanIdent].objectSocket;
    };

    /**
     * Human이 가리키는 사람 Ident를 설정합니다.
     * @author Scripter36(1350adwx)
     * @param {String} ident 가리킬 사람 Ident
     */
    this.setHumanIdent = function(ident) {
        this.HumanIdent = ident;
        return this;
    };

    /**
     * Human이 가리키는 사람 ident를 반환합니다.
     * @author Scripter36(1350adwx)
     * @return {String} ident
     */
    this.getHumanIdent = function() {
        return this.HumanIdent;
    };

    /**
     * Human의 체력을 반환합니다.
     * @author Scripter36(1350adwx)
     * @return {Number} 체력
     */
    this.getHealth = function() {
        if (this.HumanIdent === undefined) return;
        if (Player.objectPlayer[this.HumanIdent] === undefined) return;
        return Player.objectPlayer[this.HumanIdent].intHealth;
    };

    /**
     * Human의 체력을 설정합니다.
     * @author Scripter36(1350adwx)
     * @param {Number} health 체력
     */
    this.setHealth = function(health) {
        if (this.HumanIdent === undefined) return this;
        if (Player.objectPlayer[this.HumanIdent] === undefined) return this;
        if (isNaN(health)) return this;
        Player.objectPlayer[this.HumanIdent].intHealth = health;
        this.update();
        return this;
    };

    /**
     * Human의 팀명을 가져옵니다.
     * @author Scripter36(1350adwx)
     * @return {String} 팀명
     */
    this.getTeamName = function() {
        if (this.HumanIdent === undefined) return;
        if (Player.objectPlayer[this.HumanIdent] === undefined) return;
        return Player.objectPlayer[this.HumanIdent].strTeam;
    };

    /**
     * Human의 이름을 가져옵니다.
     * @author Scripter36(1350adwx)
     * @return {String} 이름
     */
    this.getName = function() {
        if (this.HumanIdent === undefined) return;
        if (Player.objectPlayer[this.HumanIdent] === undefined) return;
        return Player.objectPlayer[this.HumanIdent].strName;
    };

    /**
     * Human의 이름을 설정합니다.
     * @author Scripter36(1350adwx)
     * @param {String} name 이름
     */
    this.setName = function(name) {
        if (this.HumanIdent === undefined) return this;
        if (Player.objectPlayer[this.HumanIdent] === undefined) return this;
        Player.objectPlayer[this.HumanIdent].strName = name;
        this.update();
        return this;
    };

    /**
     * 플레이어의 위치를 가져옵니다.
     * @return {Array} 위치
     */
    this.getPosition = function() {
        if (Player.objectPlayer[this.HumanIdent] === undefined) return;
        return Player.objectPlayer[this.HumanIdent].dblPosition;
    };

    /**
     * 플레이어의 위치를 설정합니다.
     * @param {Array} position 위치
     */
    this.setPosition = function(position) {
        if (typeof position === 'object' && position.length === 3) {
            Player.objectPlayer[this.HumanIdent].dblPosition = position;
            this.update();
        }
        return this;
    };

    this.getAcceleration = function() {
        return Player.objectPlayer[this.HumanIdent].dblAcceleration;
    };

    this.setAcceleration = function(acceleration) {
        if (typeof acceleration === 'object' && acceleration.length === 3) {
            Player.objectPlayer[this.HumanIdent].dblAcceleration = acceleration;
            this.update();
        }
        return this;
    };

    this.getFriction = function() {
        return Player.objectPlayer[this.HumanIdent].dblFriction;
    };

    this.setFriction = function(friction) {
        if (typeof friction === 'object' && friction.length === 3) {
            Player.objectPlayer[this.HumanIdent].dblfriction = friction;
            this.update();
        }
        return this;
    };

    this.getGravity = function() {
        return Player.objectPlayer[this.HumanIdent].dblGravity;
    };

    this.setGravity = function(gravity) {
        if (typeof gravity === 'object' && gravity.length === 3) {
            Player.objectPlayer[this.HumanIdent].dblGravity = gravity;
            this.update();
        }
        return this;
    };

    this.getMaxvel = function() {
        return Player.objectPlayer[this.HumanIdent].dblMaxvel;
    };

    this.setMaxvel = function(maxvel) {
        if (typeof maxvel === 'object' && maxvel.length === 3) {
            Player.objectPlayer[this.HumanIdent].dblMaxvel = maxvel;
            this.update();
        }
        return this;
    };

    /**
     * 플레이어의 좌/우 시야 회전을 가져옵니다.
     * @return {Double} 회전각(Radian)
     */
    this.getYaw = function() {
        return Player.objectPlayer[this.HumanIdent].dblRotation[1];
    };

    /**
     * 플레이어의 좌/우 시야 회전을 설정합니다..
     * @param {Double} yaw 회전각(Radian)
     */
    this.setYaw = function(yaw) {
        Player.objectPlayer[this.HumanIdent].dblRotation[1] = yaw;
        this.update();
        return this;
    };

    /**
     * 플레이어의 위/아래 시야 회전을 가져옵니다.
     * @return {Double} 회전각(Radian)
     */
    this.getPitch = function() {
        return Player.objectPlayer[this.HumanIdent].dblRotation[2];
    };

    /**
     * 플레이어의 위/아래 시야 회전을 설정합니다..
     * @param {Double} yaw 회전각(Radian)
     */
    this.setPitch = function(pitch) {
        Player.objectPlayer[this.HumanIdent].dblRotation[2] = pitch;
        this.update();
        return this;
    };

    this.getRotation = function() {
        return Player.objectPlayer[this.HumanIdent].dblRotation;
    };

    this.setRotation = function(rotation) {
        if (typeof rotation === 'object' && rotation.length === 3) {
            Player.objectPlayer[this.HumanIdent].dblRotation = rotation;
            this.update();
        }
        return this;
    };

    this.getSize = function() {
        return Player.objectPlayer[this.HumanIdent].dblSize;
    };

    this.setSize = function(size) {
        if (typeof size === 'object' && size.length === 3) {
            Player.objectPlayer[this.HumanIdent].dblSize = size;
            this.update();
        }
        return this;
    };

    this.getVerlet = function() {
        return Player.objectPlayer[this.HumanIdent].dblVerlet;
    };

    this.setVerlet = function(verlet) {
        if (Array.isArray(verlet) && verlet.length === 3) {
            Player.objectPlayer[this.HumanIdent].dblVerlet = verlet;
            this.update();
        }
        return this;
    };

    this.getDeaths = function() {
        return Player.objectPlayer[this.HumanIdent].intDeaths;
    };

    this.setDeaths = function(deaths) {
        if (typeof deaths === 'number') {
            Player.objectPlayer[this.HumanIdent].intDeaths = parseInt(deaths);
            this.update();
        }
        return this;
    };

    this.getJumpcount = function() {
        return Player.objectPlayer[this.HumanIdent].intJumpcount;
    };

    this.setJumpcount = function(jumpcount) {
        if (typeof jumpcount === 'number') {
            Player.objectPlayer[this.HumanIdent].intJumpcount = parseInt(jumpcount);
            this.update();
        }
        return this;
    };

    this.getKills = function() {
        return Player.objectPlayer[this.HumanIdent].intKills;
    };

    this.setKills = function(kills) {
        if (typeof kills === 'number') {
            Player.objectPlayer[this.HumanIdent].intKills = parseInt(kills);
            this.update();
        }
        return this;
    };

    this.getScore = function() {
        return Player.objectPlayer[this.HumanIdent].intScore;
    };

    this.setScore = function(score) {
        if (typeof score === 'number') {
            Player.objectPlayer[this.HumanIdent].intScore = parseInt(score);
            this.update();
        }
        return this;
    };

    this.getWeapon = function() {
        return Player.objectPlayer[this.HumanIdent].intWeapon;
    };

    this.setWeapon = function(weapon) {
        if (typeof weapon === 'number') {
            Player.objectPlayer[this.HumanIdent].intWeapon = parseInt(weapon);
            this.update();
        }
        return this;
    };

    this.showTipMessage = function(message) {
        this.getSocket().emit('showTipMessage', {
            'strText': message.toString()
        });
        return this;
    };

    this.sendMessage = function(sender, message) {
        this.getSocket().emit('eventChat', {
            'strName': sender.toString(),
            'strMessage': message.toString(),
            'strReceiver': this.getName()
        });
    };

    this.isOnGround = function() {
        if (Player.objectPlayer[this.HumanIdent] === undefined) return false;
        if (Math.abs(Player.objectPlayer[this.HumanIdent].dblPosition[1] - Player.objectPlayer[this.HumanIdent].dblVerlet[1]) === 0) return true;
        return Player.objectPlayer[this.HumanIdent].boolCollisionBottom === true && Math.abs(Player.objectPlayer[this.HumanIdent].dblPosition[1] - Player.objectPlayer[this.HumanIdent].dblVerlet[1]) < 0.0001;

    };

    this.isOnline = function() {
        return Player.objectPlayer[this.HumanIdent] !== undefined;
    };

    this.setCanFly = function(fly) {
        if (fly === undefined) fly = true;
        Player.objectPlayer[this.HumanIdent].boolFly = fly === true;
        if (fly) {
            Player.objectPlayer[this.HumanIdent].dblGravity = [0, 0, 0];
        } else {
            Player.objectPlayer[this.HumanIdent].dblGravity = [0, -0.01, 0];
        }
        this.update();
    };

    this.canFly = function() {
        return Player.objectPlayer[this.HumanIdent].boolFly;
    };

    this.kick = function(reason) {
        if (reason === undefined) reason = "서버 관리자에 의해 추방당했습니다.";
        this.getSocket().emit('kick', {
            strMessage: reason
        });
    };

    this.getIP = function() {
        var ip = this.getSocket().conn.remoteAddress;
        if (ip === "::1") return "1";
        else return ip.split(":")[3];
    };

    this.ban = function(reason) {
        if (reason === undefined) reason = "서버 관리자에 의해 추방당했습니다.";
        this.getSocket().emit('kick', {
            strMessage: reason
        });
        bannedIP.push(this.getIP());
        writeBannedIP(bannedIP);
    };

    this.isBanned = function() {
        return bannedIP.indexOf(this.getIP()) !== -1;
    };

    this.pardon = function() {
        if (bannedIP.indexOf(this.getIP()) !== -1) {
            bannedIP.splice(this.getIP());
            writeBannedIP(bannedIP);
        }
        return this;
    };

    this.setfov = function(fov) {
        this.getSocket().emit('setfov', {
            fov: fov
        });
    };
}

function Mesh() {
    var objectData = {
        id: "0",
        size: [],
        position: [],
        rotation: [0, 0, 0],
        Material: null
    };
    this.setID = function(id) {
        objectData.id = id;
        return this;
    };
    this.getID = function() {
        return objectData.id;
    };
    this.setSize = function(size) {
        objectData.size = size;
        return this;
    };
    this.getSize = function() {
        return objectData.size;
    };
    this.setPosition = function(position) {
        objectData.position = position;
        return this;
    };
    this.getPosition = function() {
        return objectData.position;
    };
    this.setRotation = function(rotation) {
        objectData.rotation = rotation;
        return this;
    };
    this.getRotation = function() {
        return objectData.rotation;
    };
    this.setMaterial = function(material) {
        objectData.Material = material;
        return this;
    };
    this.getMaterial = function() {
        return objectData.Material;
    };
    this.show = function() {
        Socket.objectServer.emit('addMesh', objectData);
        return this;
    };
    this.update = function() {
        Socket.objectServer.emit('updateMesh', objectData);
        return this;
    };
    this.remove = function() {
        Socket.objectServer.emit('removeMesh', objectData);
        return this;
    };
    this.moveTo = function(moves, time, rotatetime) {
        for (let i in moves) {
            if (moves[i].type === "move") {
                this.setPosition(moves[i].position);
            } else if (moves[i].type === "rotate") {
                var rotation = this.getRotation().slice();
                rotation[1] += moves[i].rotation;
                this.setRotation(rotation);
            }
        }
        Socket.objectServer.emit('moveMesh', {
            id: this.getID(),
            moves: moves,
            time: time,
            rotatetime: rotatetime
        });
    };
    /*
    {
      color: opts.color || 0x000000,
      wireframe: true,
      wireframeLinewidth: opts.wireframeLinewidth || 3,
      transparent: true,
      opacity: opts.wireframeOpacity || 0.5
    }
     */
}

var Drone = Mesh;
Drone.prototype.show = function() {
    Socket.objectServer.emit('addDrone', objectData);
    return this;
};

var NodeRect;
var Node;
var Aws;
var Express;
var Geoip;
var Hypertextmin;
var Mime;
var Multer;
var Mustache;
var Phantom;
var Postgres;
var Recaptcha;
var Socket;
var Xml;
var bannedIP = [];
/** @type {Module} 파일 입출력 모듈입니다. */
var fs = require('fs');

function info(message) {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    console.log("\x1b[1m\x1b[36m" + hour + ":" + min + ":" + sec + "\x1b[37m [INFO] " + message + "\x1b[0m");
}

function loadBannedIP(array) {
    fs.exists('./bannedIP.txt', function(exists) {
        if (exists) {
            fs.readFile('./bannedIP.txt', 'utf8', function(error, data) {
                if (error) throw error;
                data = data.split('\n');
                for (var i in data) array[i] = data[i];
            });
        } else {
            fs.writeFile('./bannedIP.txt', '', 'utf8', function(error) {
                if (error) throw error;
            });
        }
    });
}

function writeBannedIP(array) {
    fs.writeFile('./bannedIP.txt', array.join('\n'), 'utf8', function(error) {
        if (error) throw error;
    });
}


/** @description 내부 함수들을 정리하고 NodeRect 모듈을 가져오고 스크립트를 불러옵니다.
 * @author Scripter36(1350adwx)
 * @param {Object} nodeRect NodeRect 모듈
 */
exports.init = function(nodeRect, doneInit) {
    /** @type {NodeRect} 각종 기능을 위해 가져옵니다. */
    NodeRect = nodeRect;
    Node = NodeRect.Node;
    Aws = NodeRect.Aws;
    Express = NodeRect.Express;
    Geoip = NodeRect.Geoip;
    Hypertextmin = NodeRect.Hypertextmin;
    Mime = NodeRect.Mime;
    Multer = NodeRect.Multer;
    Mustache = NodeRect.Mustache;
    Phantom = NodeRect.Phantom;
    Postgres = NodeRect.Postgres;
    Recaptcha = NodeRect.Recaptcha;
    Socket = NodeRect.Socket;
    Xml = NodeRect.Xml;
    /** @type {Array} 스크립트 모듈들 모음입니다. */
    exports.scripts = [];
    /** @type {Boolean} 스크립트 로딩 완료 여부입니다. */
    exports.loaded = false;
    /** @type {String} 스크립트 불러올 경로입니다. */
    var path = "./scripts";
    fs.readdir(path, function(error, files) {
        if (error) {
            throw error;
        }
        /** @type {Number} count 스크립트 로딩한 숫자 */
        var count = 0;
        var Add = fs.readFileSync("./add.js").toString().split("/*SPLIT*/");
        files.forEach(function(file) {
            //확장자가 js 일 시
            if (file.endsWith(".js")) {
                //카운트 올리고
                count++;
                //로딩 알림
                info(file.substring(0, file.length - 3) + " 로드 중");
                //require 한 뒤
                var i = requireFromString(Add[0] + fs.readFileSync(path + "/" + file).toString() + Add[1], "");
                //스크립트 배열에 넣고
                module.exports.scripts.push(i);
                //활성화 알림
                info(file.substring(0, file.length - 3) + " 활성화 중");
                //처음 불러오는 함수 실행
                i.onLoad(NodeRect, Server, Human, Mesh, Drone, ChatColor);
            }
        });
        loadBannedIP(bannedIP);
        exports.callServerTickEvent();
        //로딩 여부 true
        exports.loaded = true;
        //플레이어 데이터 보내는 중 false
        exports.sendingPlayerData = false;
        //PhaseChange 여부
        exports.isPhaseChange = true;
        //완료
        doneInit.done();
    });
};

/** @description 플레이어가 로그인할 시 onPlayerLogin 함수에 전달 될 이벤트입니다.
 * @author Scripter36(1350adwx)
 * @param {Object} objectSocket 로그인 소켓
 * @param {Object} objectData 로그인 관련 데이터
 * @param {Object} resultData 로그인 처리 결과 데이터
 * @class
 */
exports.PlayerLoginEvent = function(objectSocket, objectData, resultData) {
    /** @type {Boolean} PlayerLoginEvent의 취소 여부입니다. */
    var canceled = false;
    /** @type {String} PlayerLoginEvent를 취소당한 플레이어가 받을 메시지입니다. */
    var canceledMessage = "Login Canceled by Script.";


    /** @description PlayerLoginEvent의 취소 여부를 설정합니다.
     * @author Scripter36(1350adwx)
     * @param {boolean} cancel 취소 여부. undefined 일 시(즉 쓰지 않을 시) true
     * @return {PlayerLoginEvent} 메소드 체이닝을 위하여 자기 자신을 반환합니다.
     */
    this.setCanceled = function(cancel) {
        //undefined 일 시에만 true로 변경
        if (cancel === undefined) cancel = true;
        //Boolean 타입으로 변환
        canceled = cancel === true;
        //메소드 체이닝.
        return this;
    };

    /** @description PlayerLoginEvent의 취소 여부를 반환합니다.
     * @author Scripter36(1350adwx)
     * @return {boolean} 취소 여부
     */
    this.isCanceled = function() {
        return canceled;
    };

    /** @description PlayerLoginEvent를 발동시킨 플레이어의 이름을 변경합니다.
     * @author Scripter36(1350adwx)
     * @param {String} name 설정할 이름
     * @return {PlayerLoginEvent} 메소드 체이닝
     */
    this.setName = function(name) {
        objectData.strName = name.toString();
        return this;
    };

    this.getHuman = function() {
        return new Human().setHumanIdent(Player.objectPlayer[objectSocket.strIdent].strIdent);
    };

    /** @description PlayerLoginEvent를 발동시킨 플레이어의 이름을 반환합니다.
     * @author Scripter36(1350adwx)
     * @return {String} 플레이어의 이름
     */
    this.getName = function() {
        return objectData.strName;
    };

    /** @description PlayerLoginEvent를 발동시킨 플레이어의 팀 이름을 변경합니다.
     * @author Scripter36(1350adwx)
     * @param {String} team 바뀔 팀의 이름
     * @return {PlayerLoginEvent} 메소드 체이닝
     */
    this.setTeamName = function(team) {
        objectData.strTeam = team.toString();
        return this;
    };

    /** @description PlayerLoginEvent를 발동시킨 플레이어의 팀 이름을 반환합니다.
     * @author Scripter36(1350adwx)
     * @return {String} 팀 이름
     */
    this.getTeamName = function() {
        return objectData.strTeam;
    };

    /** @description PlayerLoginEvent가 성공하였는지를 반환합니다.
     * @author Scripter36(1350adwx)
     * @return {Boolean} 성공 여부
     */
    this.isSuccessed = function() {
        return resultData.strType !== "typeReject";
    };

    /** @description PlayerLoginEvent 실패 이유를 설정합니다.
     * @author Scripter36(1350adwx)
     * @param {String} reason 설정할 실패 이유
     * @return {PlayerLoginEvent} 메소드 체이닝
     */
    this.setRejectReason = function(reason) {
        resultData.strMessage = reason.toString();
        return this;
    };

    /** @description PlayerLoginEvent 실패 이유를 반환합니다.
     * @author Scripter36(1350adwx)
     * @return {String} 실패 이유
     */
    this.getRejectReason = function() {
        return resultData.strMessage;
    };

    /** @description PlayerLoginEvent 취소 이유를 반환합니다.
     * @author Scripter36(1350adwx)
     * @return {String} 이유
     */
    this.getCanceledMessage = function() {
        return canceledMessage;
    };

    /** @description PlayerLoginEvent 취소 이유를 반환합니다.
     * @author Scripter36(1350adwx)
     * @param {String} message 이유
     * @return {PlayerLoginEvent} 메소드 체이닝
     */
    this.setCanceledMessage = function(message) {
        canceledMessage = message.toString();
        return this;
    };
};

/**
 * PlayerLoginEvent를 모든 스크립트에게 전송합니다.
 * @author Scripter36(1350adwx)
 * @param  {Object} objectData
 * @param  {Object} objectSocket
 * @return {PlayerLoginEvent} PlayerLoginEvent
 */
exports.callPlayerLoginEvent = function(objectData, objectSocket) {
    let event = new exports.PlayerLoginEvent(objectData, objectSocket);
    if (event.getHuman().isBanned()) {
        event.setCanceled();
        event.setCanceledMessage("서버 관리자에 의해 밴 당했습니다.");
    }
    for (let i of exports.scripts) {
        if (typeof i.onPlayerLogin != "undefined") {
            i.onPlayerLogin(event);
        }
    }
    info(ChatColor.FgCyan + event.getName() + ChatColor.FgWhite + "[/" + event.getHuman().getIP() + "] 님이 엔티티 아이디 " + event.getHuman().getHumanIdent() + " 에서 로그인 했습니다.");
    Server.sendMessage("", event.getName() + " 님이 게임에 참여했습니다.");
    return event;
};

/**
 * 플레이어가 채팅을 할 시 발동됩니다.
 * @author Scripter36(1350adwx)
 * @param {Object} objectData 각종 정보
 * @param {Object} objectSocket 플레이어 불러오기 등등을 위함
 * @class
 */
exports.PlayerChatEvent = function(objectData, objectSocket) {

    /** @type {Boolean} PlayerChatEvent의 취소 여부입니다. */
    var canceled = false;


    /** @type {String} PlayerChatEvent를 발동시킨 사람 이름입니다. */
    var name = Player.objectPlayer[objectSocket.strIdent].strName;

    /** @type {Number} PlayerChatEvent에서 허용되는 최대 채팅 길이입니다. 이것 이후로는 잘립니다. */
    var maxLeng = 140;

    /** @type {String} 취소당한 플레이어에게 보낼 메시지 */
    var canceledMessage = null;

    /**
     * 취소당한 플레이어에게 보여질 보낸 사람 이름입니다. 공백이면 안 보입니다.
     * @author Scripter36(1350adwx)
     * @type {String}
     */
    var canceledSender = "";

    /**
     * PlayerChatEvent 취소 여부를 설정합니다.
     * @author Scripter36(1350adwx)
     * @param {Boolean} cancel 취소 여부. undefined 일 시 true입니다.
     */
    this.setCanceled = function(cancel) {
        if (cancel === undefined) cancel = true;
        canceled = cancel === true;
        return this;
    };

    /**
     * PlayerChatEvent 취소 여부를 반환합니다.
     * @author Scripter36(1350adwx)
     * @return {Boolean} 취소 여부
     */
    this.isCanceled = function() {
        return canceled;
    };

    /**
     * PlayerChatEvent를 발생시킨 플레이어의 Ident를 가져옵니다.
     * @author Scripter36(1350adwx)
     * @return {String} 플레이어 Ident
     * @deprecated getHuman을 사용하여 주세요.
     */
    this.getPlayerIdent = function() {
        return objectSocket.strIdent;
    };

    /**
     * PlayerChatEvent를 발생시킨 Human을 가져옵니다.
     * @author Scripter36(1350adwx)
     * @return {Human} Human
     */
    this.getHuman = function() {
        return new Human().setHumanIdent(objectSocket.strIdent);
    };

    /**
     * PlayerChatEvent에서 채팅 메시지를 가져옵니다.
     * @author Scripter36(1350adwx)
     * @return {String} 채팅 메시지
     */
    this.getMessage = function() {
        return objectData.strMessage;
    };

    /**
     * PlayerChatEvent에서 채팅 메시지를 변경합니다.
     * @author Scripter36(1350adwx)
     * @param {String} message 변경할 메시지
     */
    this.setMessage = function(message) {
        objectData.strMessage = message.toString();
        return this;
    };

    /**
     * PlayerChatEvent를 발생시킨 사람 이름을 반환합니다.
     * @author Scripter36(1350adwx)
     * @return {String} 이름
     */
    this.getName = function() {
        return name;
    };

    /**
     * PlayerChatEvent를 발생시킨 사람 이름을 수정합니다.
     * @author Scripter36(1350adwx)
     * @param {String} name 변경될 이름
     */
    this.setName = function(name) {
        name = name.toString();
        return this;
    };

    /**
     * PlayerChatEvent를 발생시킨 플레이어의 Ident를 가져옵니다.
     * @author Scripter36(1350adwx)
     * @return {String} 플레이어 Ident
     * @deprecated getHuman을 사용하여 주세요.
     */
    this.getPlayerIdent = function() {
        return objectSocket.strIdent;
    };

    /**
     * PlayerChatEvent를 발생시킨 Human을 가져옵니다.
     * @author Scripter36(1350adwx)
     * @return {Human} Human
     */
    this.getHuman = function() {
        return new Human().setHumanIdent(objectSocket.strIdent);
    };

    /**
     * PlayerChatEvent에서의 채팅 최대 길이를 불러옵니다.
     * @author Scripter36(1350adwx)
     * @return {Number} 최대 길이
     */
    this.getMaxLength = function() {
        return maxLeng;
    };

    /**
     * PlayerChatEvent에서의 채팅 최대 길이를 설정합니다.
     * @author Scripter36(1350adwx)
     * @param {Number} leng 채팅 최대 길이
     */
    this.setMaxLength = function(leng) {
        if (isNaN(leng)) return this;
        leng = parseInt(leng);
        if (leng < 0) return this;
        maxLeng = leng;
        return this;
    };

    /**
     * PlayerChatEvent 취소시 나올 메시지를 설정합니다.
     * @author Scripter36(1350adwx)
     * @param {String} message 메시지
     */
    this.setCanceledMessage = function(message) {
        if (message === undefined || message === null) {
            message = null;
        } else message = message.toString();
        canceledMessage = message;
        return this;
    };

    /**
     * PlayerChatEvent 취소시 나올 메시지를 가져옵니다.
     * @author Scripter36(1350adwx)
     * @return {String} 메시지
     */
    this.getCanceledMessage = function() {
        return canceledMessage;
    };

    /**
     * PlayerChatEvent 취소시 나올 사람 이름을 설정합니다.
     * @author Scripter36(1350adwx)
     * @param {String} sender 이름
     */
    this.setCanceledSender = function(sender) {
        if (sender === undefined || sender === null) {
            sender = "";
        } else sender = sender.toString();
        canceledSender = sender;
        return this;
    };

    /**
     * PlayerChatEvent 취소시 나올 사람 이름을 가져옵니다.
     * @author Scripter36(1350adwx)
     * @return {String} 이름
     */
    this.getCanceledSender = function() {
        return canceledSender;
    };
};

/**
 * PlayerChatEvent를 모든 스크립트에게 전송합니다.
 * @author Scripter36(1350adwx)
 * @param  {Object} objectData
 * @param  {Object} objectSocket
 * @return {PlayerChatEvent} PlayerChatEvent
 */
exports.callPlayerChatEvent = function(objectData, objectSocket) {
    let event = new exports.PlayerChatEvent(objectData, objectSocket);
    for (let i of exports.scripts) {
        if (typeof i.onPlayerChat != "undefined") {
            i.onPlayerChat(event);
        }
    }
    info(event.getHuman().getName() + ": " + event.getMessage());
    return event;
};

/**
 * 플레이어가 블럭을 설치했을 때 발동됩니다.
 * @author Scripter36(1350adwx)
 * @param {Object} objectData   [description]
 * @param {Object} objectSocket [description]
 * @class
 */
exports.BlockPlaceEvent = function(objectData, objectSocket) {

    /** @type {Boolean} BlockPlaceEvent의 취소 여부입니다 */
    var canceled = false;

    /**
     * BlockPlaceEvent의 취소 여부를 설정합니다.
     * @author Scripter36(1350adwx)
     * @param {Boolean} cancel 취소 여부
     */
    this.setCanceled = function(cancel) {
        if (cancel === undefined) cancel = true;
        canceled = cancel === true;
        return this;
    };

    /**
     * BlockPlaceEvent의 취소 여부를 반환합니다.
     * @author Scripter36(1350adwx)
     * @return {Boolean} 블럭 설치 취소 여부
     */
    this.isCanceled = function() {
        return canceled;
    };

    /**
     * BlockPlaceEvent에서 설치될 블럭의 타입을 설정합니다.
     * @author Scripter36(1350adwx)
     * @param {String} type 블럭 타입
     */
    this.setBlockType = function(type) {
        if (type === undefined) return this;
        objectData.strType = type.toString();
        return this;
    };

    /**
     * BlockPlaceEvent에서 설치될 블럭의 타입을 반환합니다.
     * @author Scripter36(1350adwx)
     * @return {String} 블럭 타입
     */
    this.getBlockType = function() {
        return objectData.strType;
    };

    /**
     * BlockPlaceEvent를 발생시킨 Human을 가져옵니다.
     * @author Scripter36(1350adwx)
     * @return {Human} Human
     */
    this.getHuman = function() {
        return new Human().setHumanIdent(objectSocket.strIdent);
    };

    /**
     * BlockPlaceEvent가 일어난 위치를 반환합니다.
     * @author Scripter36(1350adwx)
     * @return {Array} 위치([x, y, z])
     */
    this.getPosition = function() {
        return objectData.intCoordinate;
    };

    /**
     * BlockPlaceEvent가 일어날 위치를 설정합니다.
     * @author Scripter36(1350adwx)
     * @param {position} position 위치
     */
    this.setPosition = function(position) {
        if (typeof position === 'object' && position.length === 3) {
            objectData.intCoordinate = position;
            return this;
        }
        return this;
    };
};


/**
 * 플레이어가 블럭을 파괴했을 때 발동됩니다.
 * @author Scripter36(1350adwx)
 * @param {Object} objectData   [description]
 * @param {Object} objectSocket [description]
 * @class
 */
exports.BlockBreakEvent = function(objectData, objectSocket) {

    /** @type {Boolean} BlockBreakEvent 취소 여부입니다 */
    var canceled = false;

    /**
     * BlockBreakEvent의 취소 여부를 설정합니다.
     * @author Scripter36(1350adwx)
     * @param {Boolean} cancel 취소 여부
     */
    this.setCanceled = function(cancel) {
        if (cancel === undefined) cancel = true;
        canceled = cancel === true;
        return this;
    };

    /**
     * BlockBreakEvent의 취소 여부를 반환합니다.
     * @author Scripter36(1350adwx)
     * @return {Boolean} 블럭 설치 취소 여부
     */
    this.isCanceled = function() {
        return canceled;
    };

    /**
     * BlockBreakEvent를 발생시킨 플레이어의 Ident를 가져옵니다.
     * @author Scripter36(1350adwx)
     * @return {String} 플레이어 Ident
     * @deprecated getHuman을 사용하여 주세요.
     */
    this.getPlayerIdent = function() {
        return objectSocket.strIdent;
    };

    /**
     * BlockBreakEvent를 발생시킨 Human을 가져옵니다.
     * @author Scripter36(1350adwx)
     * @return {Human} Human
     */
    this.getHuman = function() {
        return new Human().setHumanIdent(objectSocket.strIdent);
    };

    /**
     * BlockBreakEvent가 일어난 위치를 반환합니다.
     * @author Scripter36(1350adwx)
     * @return {Array} 위치([x, y, z])
     */
    this.getPosition = function() {
        return objectData.intCoordinate;
    };

    /**
     * BlockBreakEvent가 일어날 위치를 설정합니다.
     * @author Scripter36(1350adwx)
     * @param {position} position 위치
     */
    this.setPosition = function(position) {
        if (typeof position === 'object' && position.length === 3) {
            objectData.intCoordinate = position;
            return this;
        }
        return this;
    };

};

/**
 * BlockPlaceEvent를 모든 스크립트에게 전송합니다.
 * @author Scripter36(1350adwx)
 * @param  {Object} objectData
 * @param  {Object} objectSocket
 * @return {BlockPlaceEvent} BlockPlaceEvent
 */
exports.callBlockPlaceEvent = function(objectData, objectSocket) {
    let event = new exports.BlockPlaceEvent(objectData, objectSocket);
    for (let i of exports.scripts) {
        if (typeof i.onBlockPlace != "undefined") {
            i.onBlockPlace(event);
        }
    }
    return event;
};

/**
 * BlockBreakEvent를 모든 스크립트에게 전송합니다.
 * @author Scripter36(1350adwx)
 * @param  {Object} objectData
 * @param  {Object} objectSocket
 * @return {BlockBreakEvent} BlockBreakEvent
 */
exports.callBlockBreakEvent = function(objectData, objectSocket) {
    let event = new exports.BlockBreakEvent(objectData, objectSocket);
    for (let i of exports.scripts) {
        if (typeof i.onBlockBreak != "undefined") {
            i.onBlockBreak(event);
        }
    }
    return event;
};

/**
 * 플레이어가 연결을 종료할 때 발동됩니다.
 * @param {Object} objectSocket
 * @class
 */
exports.PlayerQuitEvent = function(objectSocket) {
    /**
     * PlayerQuitEvent를 발생시킨 플레이어의 Ident를 가져옵니다.
     * @author Scripter36(1350adwx)
     * @return {String} 플레이어 Ident
     * @deprecated getHuman을 사용하여 주세요.
     */
    this.getPlayerIdent = function() {
        return objectSocket.strIdent;
    };

    /**
     * PlayerQuitEvent를 발생시킨 Human을 가져옵니다.
     * @author Scripter36(1350adwx)
     * @return {Human} Human
     */
    this.getHuman = function() {
        return new Human().setHumanIdent(objectSocket.strIdent);
    };

    /**
     * PlayerQuitEvent를 발동시킨 사람 이름을 반환합니다.
     * @return {String} 이름
     */
    this.getName = function() {
        return this.getHuman().getName();
    };
};

/**
 * PlayerQuitEvent를 모든 스크립트에게 전송합니다.
 * @author Scripter36(1350adwx)
 * @param  {Object} objectSocket
 * @return {BlockBreakEvent} PlayerQuitEvent
 */
exports.callPlayerQuitEvent = function(objectSocket) {
    if (new Human().setHumanIdent(objectSocket.strIdent).getName() === "") return;
    let event = new exports.PlayerQuitEvent(objectSocket);
    for (let i of exports.scripts) {
        if (typeof i.onPlayerQuit != "undefined") {
            i.onPlayerQuit(event);
        }
    }
    info(ChatColor.FgCyan + event.getName() + ChatColor.FgWhite + "[/" + event.getHuman().getIP() + "] 님이 로그아웃 했습니다.");
    Server.sendMessage("", event.getName() + " 님이 게임에서 나갔습니다.");
    return event;
};


exports.PlayerRespawnEvent = function(objectPlayer) {
    /**
     * PlayerRespawnEvent를 발생시킨 플레이어의 Ident를 가져옵니다.
     * @author Scripter36(1350adwx)
     * @return {String} 플레이어 Ident
     * @deprecated getHuman을 사용하여 주세요.
     */
    this.getPlayerIdent = function() {
        return objectPlayer.strIdent;
    };

    /**
     * PlayerRespawnEvent를 발생시킨 Human을 가져옵니다.
     * @author Scripter36(1350adwx)
     * @return {Human} Human
     */
    this.getHuman = function() {
        return new Human().setHumanIdent(objectPlayer.strIdent);
    };

    /**
     * PlayerRespawnEvent를 발동시킨 사람 이름을 반환합니다.
     * @return {String} 이름
     */
    this.getName = function() {
        return this.getHuman().getName();
    };
};

/**
 * PlayerRespawnEvent를 모든 스크립트에게 전송합니다.
 * @author Scripter36(1350adwx)
 * @param  {Object} objectSocket
 * @return {BlockBreakEvent} PlayerRespawnEvent
 */
exports.callPlayerRespawnEvent = function(objectSocket) {
    if (new Human().setHumanIdent(objectSocket.strIdent).getName() === "") return;
    let event = new exports.PlayerRespawnEvent(objectSocket);
    for (let i of exports.scripts) {
        if (typeof i.onPlayerRespawn != "undefined") {
            i.onPlayerRespawn(event);
        }
    }
    return event;
};

/**
 * 플레이어가 플레이어를 공격할 때 발동됩니다.
 * @param {Object} objectPlayer 맞은 사람
 * @param {Object} objectItem   맞힌 아이템
 * @class
 */
exports.PlayerHitEvent = function(objectPlayer, objectItem, Damage) {
    /** @type {Boolean} */
    var canceled = false;
    /** @type {Number} */
    var damage = Damage;
    /**
     * PlayerHitEvent를 취소합니다.
     * @param {Boolean} cancel 취소 여부
     */
    this.setCanceled = function(cancel) {
        if (cancel === undefined) cancel = true;
        canceled = cancel === true;
        return this;
    };

    /**
     * PlayerHitEvent 취소 여부를 반환합니다.
     * @return {Boolean} 취소 여부
     */
    this.isCanceled = function() {
        return canceled;
    };

    /**
     * 공격한 사람을 반환합니다.
     * @return {Human} 가해자
     */
    this.getAttacker = function() {
        return new Human().setHumanIdent(objectItem.strPlayer);
    };

    /**
     * 공격한 사람을 설정합니다.
     * @param {Human} human 가해자
     */
    this.setAttacker = function(human) {
        if (human instanceof Human) objectItem.strPlayer = human.getHumanIdent();
        return this;
    };

    /**
     * 공격받은 사람을 반환합니다.
     * @return {Human} 피해자
     */
    this.getVictim = function() {
        return new Human().setHumanIdent(objectPlayer.strIdent);
    };

    /**
     * 공격받은 사람을 설정합니다.
     * @param {Human} human 피해자
     */
    this.setVictim = function(human) {
        if (human instanceof Human) objectPlayer = human.getHumanIdent();
        return this;
    };

    /**
     * 공격의 데미지를 반환합니다.
     * @return {Number} 데미지
     */
    this.getDamage = function() {
        return damage;
    };

    /**
     * 공격의 데미지를 설정합니다.
     * @param {Number} d 데미지
     */
    this.setDamage = function(d) {
        if (isNaN(d)) return this;
        damage = parseInt(d);
        return this;
    };

    /**
     * 아이템의 이름을 받아옵니다.
     * @return {String} 아이템 이름
     */
    this.getItemName = function() {
        return objectItem.strIdent.split("-")[0];
    };

    /**
     * 아이템의 이름을 설정합니다.
     * @param {String} name 아이템 이름
     */
    this.setItemName = function(name) {
        let ident = objectItem.strIdent.split("-");
        ident.splice(0, 1);
        objectItem.strIdent = name.toString() + "-" + ident;
    };
};

/**
 * PlayerHitEvent를 모든 스크립트에게 전송합니다.
 * @author Scripter36(1350adwx)
 * @param  {Object} objectPlayer 피해자
 * @param  {Object} objectItem   때린 아이템
 * @param  {Number} damage       데미지
 * @return {PlayerHitEvent}      PlayerHitEvent
 */
exports.callPlayerHitEvent = function(objectPlayer, objectItem, damage) {
    let event = new exports.PlayerHitEvent(objectPlayer, objectItem, damage);
    for (let i of exports.scripts) {
        if (typeof i.onPlayerHit != "undefined") {
            i.onPlayerHit(event);
        }
    }
    return event;
};

/**
 * 플레이어가 죽을 때 발동됩니다.
 * @param {Object} objectPlayer 죽은 사람
 * @class
 */
exports.PlayerDeathEvent = function(objectPlayer) {
    /** @type {Boolean} */
    var canceled = false;
    /**
     * PlayerDeathEvent를 취소합니다.
     * @param {Boolean} cancel 취소 여부
     */
    this.setCanceled = function(cancel) {
        if (cancel === undefined) cancel = true;
        canceled = cancel === true;
        return this;
    };

    /**
     * PlayerDeathEvent 취소 여부를 반환합니다.
     * @return {Boolean} 취소 여부
     */
    this.isCanceled = function() {
        return canceled;
    };

    /**
     * 죽은 사람을 반환합니다.
     * @return {Human} 사람
     */
    this.getHuman = function() {
        return new Human().setHumanIdent(objectPlayer.strIdent);
    };

    /**
     * 죽은 사람을 설정합니다.
     * @param {Human} human 사람
     */
    this.setHuman = function(human) {
        if (human instanceof Human) objectPlayer = human.getHumanIdent();
        return this;
    };
};

/**
 * PlayerDeathEvent를 모든 스크립트에게 전송합니다.
 * @author Scripter36(1350adwx)
 * @param  {Object} objectPlayer 죽은 사람
 * @return {PlayerDeathEvent}      PlayerDeathEvent
 */
exports.callPlayerDeathEvent = function(objectPlayer) {
    let event = new exports.PlayerDeathEvent(objectPlayer);
    for (let i of exports.scripts) {
        if (typeof i.onPlayerDeath != "undefined") {
            i.onPlayerDeath(event);
        }
    }
    return event;
};


exports.callServerTickEvent = function() {
    for (let i of exports.scripts) {
        if (typeof i.onServerTick != "undefined") {
            i.onServerTick();
        }
    }
};

exports.ConsoleCommandEvent = function(line) {
    var message = line;
    this.getMessage = function() {
        return message;
    };
};

exports.callConsoleCommandEvent = function(line) {
    var event = new exports.ConsoleCommandEvent(line);
    for (let i of exports.scripts) {
        if (typeof i.onConsoleCommand != "undefined") {
            i.onConsoleCommand(event);
        }
    }
};
