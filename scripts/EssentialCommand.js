function onConsoleCommand(event) {
    var cmd = event.getMessage();
    var data = cmd.split(" ");
    if (data[0] == "help") {

    } else if (data[0] == "kill") {
        if (data.length < 2) {
            Server.info(ChatColor.FgRed + "사용법: /kill [이름]");
            return;
        }
        var human = Server.getPlayer(data[1]);
        if (human == undefined) {
            Server.info(ChatColor.FgRed + data[1] + "님을 찾을 수 없습니다.");
            return;
        }
        human.setHealth(0);
        Server.info(data[1] + "님을 죽였습니다.");
    }
}
