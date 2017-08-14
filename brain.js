var PORT = '';
var HOST = '127.0.0.1';

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

const readline = require('readline');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.question('Your port is: ',(answer) =>{
	console.log('is: ${answer}');
	//PORT = ${answer};

	rl.close();
});

server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
    console.log(remote.address + ':' + remote.port +' - ' + message);
    /*
    if(message === 'true') {
      return message;
    }
    */
    c


});

server.bind(PORT, HOST);
