var dgram = require("dgram");

var server = dgram.createSocket("udp4");

server.on("message", function (msg, rinfo) {
    setTimeout(function() {console.log("server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);} , 2000);

});

server.on("listening", function () {
  var address = server.address();
  console.log("server listening " +
      address.address + ":" + address.port);
});

server.bind(5004);