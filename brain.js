var dgram = require("dgram");

var server = dgram.createSocket("udp4");
const readline = require('readline');

var port;

const rl = readline.createInterface({
	input: process.stdin,
	//output: process.stdout
});

server.on("message", function (msg, rinfo) {
  console.log("server got: " + msg + " from " +
    rinfo.address + ":" + rinfo.port);
});

	rl.question('Input your port: ', (answer)=>{
		port = answer;
		rl.close();
	});

server.on("listening", function () {


  var address = server.address();
  console.log("server is running on " +
      address.address + ":" + address.port);
});

server.bind(port);