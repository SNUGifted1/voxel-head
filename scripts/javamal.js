var undo = [];
var redo = [];
var maximum = 100;
function javamal(data, human, save, pos, yaw, pitch, rotate, type, undonum, blockData, drone) {
    try {
        var number = "";
        for (var i = 0; i < data.length; i++) {
            if (data[i] === '(') {
                var calculate = data.substring(i + 1, data.length).split(')')[0];
                var changed = false;
                for (var j in playerVariable[human.getHumanIdent()]) {
                    if (calculate === j) {
                        data = data.replace("(" + calculate + ")", playerVariable[human.getHumanIdent()][j]);
                        changed = true;
                        break;
                    }
                }
                if (!changed) {
                    data = data.replace("(" + calculate + ")", "@");
                    if (calculate.startsWith("##")) {
                        type = calculate.replace('##', '');
                    } else {
                        for (var j in playerVariable[human.getHumanIdent()]) {
                            calculate = calculate.split(j).join("playerVariable['" + human.getHumanIdent() + "']['" + j + "']");
                        }
						if (calculate.indexOf('.') !== -1 || calculate.indexOf('"') !== -1 || calculate.indexOf("'") !== -1){
							human.sendMessage("[JavaSecurity]", "해킹 시도 감지!");
							return;
						}
                        eval(calculate);
                    }
                }
            }
            if (!isNaN(data[i])) {
                number += data[i];
            } else {
                if (isNaN(number) || number === "") number = 1;
                else number = parseInt(number);
                if (data[i] === '<') {
                    var match = 1;
                    var close;
                    for (var k = i + 1; k < data.length; k++) {
                        if (data[k] === '<') match++;
                        else if (data[k] === '>') match--;
                        if (match === 0) {
                            close = k;
                            break;
                        }
                    }
                    if (close !== undefined) {
                        for (var j = 0; j < number; j++) javamal(data.substring(i + 1, close), human, save, pos, yaw, pitch, rotate, type, undonum, blockData, drone);
                        i += close - i;
                    }
                } else
                    for (var j = 0; j < number; j++) {
                        if (data[i] === 's') { //앞으로 1칸
                            pos[0] += rotate[0];
                            pos[2] += rotate[2];
							if (!drone) undo[human.getHumanIdent()][undonum].push({
								pos: pos.slice(),
								block: Server.getBlock(pos.slice())
							});
                            //Server.setBlock(pos.slice(), type);
                            blockData.push({
                                pos: pos.slice(),
								block: type
                            });
                        } else if (data[i] === 'd') { //아래로 1칸
                            pos[1] -= 1;
							if (!drone) undo[human.getHumanIdent()][undonum].push({
								pos: pos.slice(),
								block: Server.getBlock(pos.slice())
							});
                            //Server.setBlock(pos.slice(), type);
                            blockData.push({
                                pos: pos.slice(),
								block: type
                            });
                        } else if (data[i] === 'u') { //위로 1칸
                            pos[1] += 1;
							if (!drone) undo[human.getHumanIdent()][undonum].push({
								pos: pos.slice(),
								block: Server.getBlock(pos.slice())
							});
                            //Server.setBlock(pos.slice(), type);
                            blockData.push({
                                pos: pos.slice(),
								block: type
                            });
                        } else if (data[i] === 'r') { //오른쪽 1
                            yaw -= 90;
                            pos[0] += Math.round(-Math.sin(yaw));
                            pos[2] += Math.round(-Math.cos(yaw));
                            if (!drone) undo[human.getHumanIdent()][undonum].push({
								pos: pos.slice(),
								block: Server.getBlock(pos.slice())
							});
                            //Server.setBlock(pos.slice(), type);
                            blockData.push({
                                pos: pos.slice(),
								block: type
                            });
                            yaw += 90;
                        } else if (data[i] === 'l') { //왼쪽 1
                            yaw += 90;
                            pos[0] += Math.round(-Math.sin(yaw));
                            pos[2] += Math.round(-Math.cos(yaw));
							if (!drone) undo[human.getHumanIdent()][undonum].push({
								pos: pos.slice(),
								block: Server.getBlock(pos.slice())
							});
                            //Server.setBlock(pos.slice(), type);
                            blockData.push({
                                pos: pos.slice(),
								block: type
                            });
                            yaw -= Math.PI / 2;
                        } else if (data[i] === 'R') { //오른쪽으로 회전
                            yaw -= Math.PI / 2;
                            rotate = [Math.round(-Math.sin(yaw)), Math.round(Math.sin(pitch)), Math.round(-Math.cos(yaw))];
                            if (drone){
                                blockData.push({
                                    rotation: -Math.PI / 2
                                });
                            }
                        } else if (data[i] === 'L') { //왼쪽으로 회전
                            yaw += Math.PI / 2;
                            rotate = [Math.round(-Math.sin(yaw)), Math.round(Math.sin(pitch)), Math.round(-Math.cos(yaw))];
                            if (drone){
                                blockData.push({
                                    rotation: Math.PI / 2
                                });
                            }
                        } else if (data[i] === 'h') { //투명블럭 생성 (블럭 제거)
                            type = null;
                        } else if (data[i] === 'c') { //벽돌블럭 생성
                            type = "voxelDirt";
                        } else if (data[i] === 'S') { //앞으로 1칸, 모양 변경
                            pos[0] += rotate[0];
                            pos[2] += rotate[2];
							if (!drone) undo[human.getHumanIdent()][undonum].push({
								pos: pos.slice(),
								block: Server.getBlock(pos.slice())
							});
                            //Server.setBlock(pos.slice(), "voxelBrick");
                            blockData.push({
                                pos: pos.slice(),
								block: "voxelBrick"
                            });
                        } else if (data[i] === '[') {
                            save.push({
                                pos: pos.slice(),
                                yaw: yaw
                            });
                        } else if (data[i] === ']') {
                            for (var j = 0; j < 3; j++) pos[j] = save[save.length - 1].pos[j];
                            yaw = save[save.length - 1].yaw;
                            rotate = [Math.round(-Math.sin(yaw)), Math.round(Math.sin(pitch)), Math.round(-Math.cos(yaw))];
                            save.splice(save.length - 1, 1);
                        }
                    }
                number = "";
            }
        }
    } catch (e) {
        human.sendMessage("[Error]", e);
    }
}

var playerPromise = [];
var playerVariable = [];
var playerDrone = [];
function onPlayerChat(event) {
    if (!event.getMessage().startsWith('/')) return;
    event.setCanceled();
    var cmd = event.getMessage().split('/')[1];
    var human = event.getHuman();
    var data = cmd.split(' ');
    if (data[0].startsWith("do")) {
        try {
            var _playerPromise = [],
                _playerVariable = [];
            for (var i in playerPromise) {
                _playerPromise[i] = [];
                for (var j in playerPromise[i]) {
                    _playerPromise[i][j] = playerPromise[i][j];
                }
            }
            for (var i in playerVariable) {
                _playerVariable[i] = [];
                for (var j in playerVariable[i]) {
                    _playerVariable[i][j] = playerVariable[i][j];
                }
            }
            var maxPlay = 1;
            if (data[0].indexOf('_') !== -1) maxPlay = parseInt(data[0].split('_')[1]);
            data.splice(0, 1);
            var mal = data.join(' ');
            for (var i = 0; i < maxPlay; i++) {
                for (var j in playerPromise[human.getHumanIdent()]) mal = mal.split(j).join("<" + playerPromise[human.getHumanIdent()][j] + ">");
            }
            var save = [];
            var pos = human.getPosition().slice();
            var yaw = human.getRotation()[1];
            var pitch = human.getRotation()[2];
            var rotate = [Math.round(-Math.sin(yaw)), Math.round(Math.sin(pitch)), Math.round(-Math.cos(yaw))];
            var type = "voxelDirt";
            var blockData = [];
			if (undo[human.getHumanIdent()] === undefined) undo[human.getHumanIdent()] = [];
			undo[human.getHumanIdent()].push([]);
            javamal(mal, human, save, pos, yaw, pitch, rotate, type, undo[human.getHumanIdent()].length - 1, blockData, false);
            if (blockData.length > maximum){
                human.sendMessage("[JavaSecurity]", "자바말로 " + maximum + "블럭보다 많이 설치할 수 없어요!");
                return;
            }
            for (var i in blockData) Server.setBlock(blockData[i].pos, blockData[i].block);
            playerPromise = _playerPromise;
            playerVariable = _playerVariable;
            human.sendMessage("[JavaMAL]", cmd + " 실행 완료!");
        } catch (e) {
            human.sendMessage("[Error]", e);
        }
    } else if (data[0].startsWith("drone")){
        try {
            if (playerDrone[human.getHumanIdent()] === undefined){
                human.sendMessage("[Error]", "드론이 없어요! /makeDrone 명령어로 만들어 보세요.");
                return;
            }
            var _playerPromise = [],
                _playerVariable = [];
            for (var i in playerPromise) {
                _playerPromise[i] = [];
                for (var j in playerPromise[i]) {
                    _playerPromise[i][j] = playerPromise[i][j];
                }
            }
            for (var i in playerVariable) {
                _playerVariable[i] = [];
                for (var j in playerVariable[i]) {
                    _playerVariable[i][j] = playerVariable[i][j];
                }
            }
            var maxPlay = 1;
            if (data[0].indexOf('_') !== -1) maxPlay = parseInt(data[0].split('_')[1]);
            data.splice(0, 1);
            var mal = data.join(' ');
            for (var i = 0; i < maxPlay; i++) {
                for (var j in playerPromise[human.getHumanIdent()]) mal = mal.split(j).join("<" + playerPromise[human.getHumanIdent()][j] + ">");
            }
            var save = [];
            var pos = playerDrone[human.getHumanIdent()].getPosition().slice();
            var yaw = playerDrone[human.getHumanIdent()].getRotation()[1];
            var pitch = playerDrone[human.getHumanIdent()].getRotation()[2];
            var rotate = [Math.round(-Math.sin(yaw)), Math.round(Math.sin(pitch)), Math.round(-Math.cos(yaw))];
            var type = "voxelDirt";
            var blockData = [];
            javamal(mal, human, save, pos, yaw, pitch, rotate, type, null, blockData, true);
            if (blockData.length > maximum){
                human.sendMessage("[JavaSecurity]", "자바말로 " + maximum + "번 이상 움직일 수 없어요!");
                return;
            }
            var movePositions = [];
            for (var i in blockData){
                if (blockData[i].pos !== undefined){
                    movePositions.push({
                        type: "move",
                        position: blockData[i].pos.slice()
                    });
                }else{
                    movePositions.push({
                        type: "rotate",
                        rotation: blockData[i].rotation
                    });
                }
            }
            playerDrone[human.getHumanIdent()].moveTo(movePositions, 1000, 500);
            playerPromise = _playerPromise;
            playerVariable = _playerVariable;
            human.sendMessage("[JavaMAL]", cmd + " 실행 완료!");
        } catch (e) {
            human.sendMessage("[Error]", e);
        }
    } else if (data[0] === "makeDrone"){
        if (playerDrone[human.getHumanIdent()] !== undefined){
            human.sendMessage("[Error]", "이미 드론이 있어요!");
            return;
        }
        var rotation = human.getRotation();
        rotation[2] = 0;
        rotation[1] %= 2 * Math.PI;
        while (rotation[1] < 0) rotation[1] += 2 * Math.PI;
        if (rotation[1] >= Math.PI / 4 && rotation[1] < Math.PI / 4 * 3){
            rotation[1] = Math.PI / 2;
        }else if (rotation[1] >= Math.PI / 4 * 3 && rotation[1] < Math.PI / 4 * 5){
            rotation[1] = Math.PI;
        }else if (rotation[1] >= Math.PI / 4 * 5 && rotation[1] < Math.PI / 4 * 7){
            rotation[1] = Math.PI / 2 * 3;
        }else{
            rotation[1] = 0;
        }
        playerDrone[human.getHumanIdent()] = new Drone().setID(human.getHumanIdent() + "_drone").setPosition(human.getPosition()).setRotation(rotation).setMaterial({
            color: 0x000000,
            wireframe: true,
            wireframeLinewidth: 3,
            transparent: true,
            opacity: 0.5
        }).setSize([1, 1 / 6, 1]).show();
        human.sendMessage("[JavaMAL]", "드론을 만들었어요!");
    } else if (data[0] === "removeDrone"){
        if (playerDrone[human.getHumanIdent()] === undefined){
            human.sendMessage("[Error]", "드론이 없어요!");
            return;
        }
        playerDrone[human.getHumanIdent()] = undefined;
        human.sendMessage("[JavaMAL]", "드론을 제거했어요!");
    }else if (data[0] === "promise") {
        try {
            if (data[1].length !== 1) {
                human.sendMessage("[Error]", "함수 / 변수명은 한 글자여야 해요!");
                return;
            }
            if (isNaN(data[2])) {
                if (playerPromise[human.getHumanIdent()] === undefined) playerPromise[human.getHumanIdent()] = [];
                playerPromise[human.getHumanIdent()][data[1]] = data[2];
                human.sendMessage("[JavaMAL]", data[1] + "을(를) " + data[2] + "(으)로 약속했어요!");
            } else {
                if (playerVariable[human.getHumanIdent()] === undefined) playerVariable[human.getHumanIdent()] = [];
                playerVariable[human.getHumanIdent()][data[1]] = data[2];
                human.sendMessage("[JavaMAL]", data[1] + "을(를) " + data[2] + "(으)로 정의했어요!");
            }
        } catch (e) {
            human.sendMessage("[Error]", e);
        }
    } else if (data[0] === "undo"){
		if (undo[human.getHumanIdent()].length === 0){
			human.sendMessage("[Error]", "되돌릴 내용이 없어요!");
			return;
		}
		var leng = undo[human.getHumanIdent()].length - 1;
		if (redo[human.getHumanIdent()] === undefined) redo[human.getHumanIdent()] = [];
		redo[human.getHumanIdent()].push([]);
		var redoleng = redo[human.getHumanIdent()].length - 1;
		for (var i in undo[human.getHumanIdent()][leng]){
			redo[human.getHumanIdent()][redoleng].push({
				pos: undo[human.getHumanIdent()][leng][i].pos.slice(),
				block: Server.getBlock(undo[human.getHumanIdent()][leng][i].pos.slice())
			});
			Server.setBlock(undo[human.getHumanIdent()][leng][i].pos, undo[human.getHumanIdent()][leng][i].block);
		}
		human.sendMessage("[JavaMAL]", undo[human.getHumanIdent()][leng].length + "개의 블럭을 되돌렸어요!");
		undo[human.getHumanIdent()].splice(leng, 1);
	} else if (data[0] === "forceundo"){
		var player = Server.getPlayer(data[1]);
		if (player === undefined){
			human.sendMessage("[Error]", data[1] + " 님을 찾을 수 없어요!");
			return;
		}
		if (undo[player.getHumanIdent()].length === 0){
			human.sendMessage("[Error]", "되돌릴 내용이 없어요!");
			return;
		}
		var leng = undo[player.getHumanIdent()].length - 1;
		if (redo[player.getHumanIdent()] === undefined) redo[player.getHumanIdent()] = [];
		redo[player.getHumanIdent()].push([]);
		var redoleng = redo[human.getHumanIdent()].length - 1;
		for (var i in undo[player.getHumanIdent()][leng]){
			redo[human.getHumanIdent()][redoleng].push({
				pos: undo[human.getHumanIdent()][leng][i].pos.slice(),
				block: Server.getBlock(undo[human.getHumanIdent()][leng][i].pos.slice())
			});
			Server.setBlock(undo[human.getHumanIdent()][leng][i].pos, undo[human.getHumanIdent()][leng][i].block);
		}
		human.sendMessage("[JavaMAL]", undo[player.getHumanIdent()][leng].length + "개의 블럭을 되돌렸어요!");
		undo[player.getHumanIdent()].splice(leng, 1);
	}else if (data[0] === "redo"){
		if (redo[human.getHumanIdent()].length === 0){
			human.sendMessage("[Error]", "되돌릴 내용이 없어요!");
			return;
		}
		var leng = redo[human.getHumanIdent()].length - 1;
		if (undo[human.getHumanIdent()] === undefined) undo[human.getHumanIdent()] = [];
		undo[human.getHumanIdent()].push([]);
		var undoleng = undo[human.getHumanIdent()].length - 1;
		for (var i in redo[human.getHumanIdent()][leng]){
			undo[human.getHumanIdent()][undoleng].push({
				pos: redo[human.getHumanIdent()][leng][i].pos.slice(),
				block: Server.getBlock(redo[human.getHumanIdent()][leng][i].pos.slice())
			});
			Server.setBlock(redo[human.getHumanIdent()][leng][i].pos, redo[human.getHumanIdent()][leng][i].block);
		}
		human.sendMessage("[JavaMAL]", redo[human.getHumanIdent()][leng].length + "개의 블럭을 되돌렸어요!");
		redo[human.getHumanIdent()].splice(leng, 1);
	} else if (data[0] === "forceredo"){
		var player = Server.getPlayer(data[1]);
		if (player === undefined){
			human.sendMessage("[Error]", data[1] + " 님을 찾을 수 없어요!");
			return;
		}
		if (redo[player.getHumanIdent()].length === 0){
			human.sendMessage("[Error]", "되돌릴 내용이 없어요!");
			return;
		}
		var leng = redo[player.getHumanIdent()].length - 1;
		if (undo[player.getHumanIdent()] === undefined) undo[player.getHumanIdent()] = [];
		undo[player.getHumanIdent()].push([]);
		var undoleng = undo[human.getHumanIdent()].length - 1;
		for (var i in redo[player.getHumanIdent()][leng]){
			undo[human.getHumanIdent()][undoleng].push({
				pos: redo[human.getHumanIdent()][leng][i].pos.slice(),
				block: Server.getBlock(redo[human.getHumanIdent()][leng][i].pos.slice())
			});
			Server.setBlock(redo[human.getHumanIdent()][leng][i].pos, redo[human.getHumanIdent()][leng][i].block);
		}
		human.sendMessage("[JavaMAL]", redo[player.getHumanIdent()][leng].length + "개의 블럭을 되돌렸어요!");
		redo[player.getHumanIdent()].splice(leng, 1);
	} else if (data[0] === "window") {
        human.setfov(parseInt(data[1]));
        human.sendMessage("[JavaMAL]", "FOV를 " + data[1] + "로 조절하였습니다.");
    }
}
///srssuurrssuurrsshsddddcsuuuuhscdhscdhscdhscduuuuhsddddcsuuuuhsdddcdssuuuu
