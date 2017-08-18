exports.browserify = function(objectBrowserify) {
    for (var strKey in objectBrowserify) {
        global[strKey] = objectBrowserify[strKey];
    }
};
var message = {};
exports.accelerometerReceiver = function(){
    var args = Array.from(arguments);
    /* args[0]: X
     * args[1]: Y
     * args[2]: Z
     * 나머지는 0
     */
    message["accelerometer"] = args.join(", ");
};
exports.batteryReceiver = function(){
    var args = Array.from(arguments);
    /* args[0]: 충전량 %
     * args[1]: 밀리볼트
     * args[2]: 온도(C)
     * 나머지는 0
     */
    //document.getElementById("idTipMessage").innerText = args[0] + "%, " + args[1] + "mV, " + args[2] + "°C";
    message["battery"] = args.join(", ");
};
exports.drl_refReceiver = function(){
    var args = Array.from(arguments);
    /* args[0]: DRL 센서
     * args[1]: REF 센서
     * 이 센서가 뭔지 아시는 분 댓글좀요
     * 나머지는 0
     */
    message["drl_ref"] = args.join(", ");
};
exports.gyroReceiver = function(){
    var args = Array.from(arguments);
    /* args[0]: X
     * args[1]: Y
     * args[2]: Z
     * 나머지는 0
     */
    message["gyro"] = args.join(", ");
};
exports.eegReceiver = function(){
    var args = Array.from(arguments);
    var type = args[0];
    args.splice(0, 1);
    /* type: 데이터 타입
     * args[0]: 왼쪽 귀
     * args[1]: 왼쪽 이마
     * args[2]: 오른쪽 이마
     * args[3]: 오른쪽 귀
     * args[4]: 왼쪽 보조 (?)
     * args[5]: 오른쪽 보조(?)
     * 라곤 하지만 타입에 따라 달라질 듯?
     * 나머지는 0
     */
    message[type] = args.join(", ");
};

setInterval(function(){
    var msg = [];
    for (var i in message) msg.push(i + ": " + message[i]);
    document.getElementById("idTipMessage").innerText = msg.join('\n');
}, 100);
