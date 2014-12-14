// Module Dependencies
var net = require('net');

// Keep track of # of connections
var count = 0,
	users = {};

// Create Server
var server = net.createServer(function(conn){
	// The nickname for the current connection;
	var nickname;

	// Handle connection
	conn.write(
		'\n > welcome to \033[92mnode-chat\033[39m!' + 
		'\n > ' + count + ' other people are connected at this time.' +
		'\n > please write your name and press enter: '
	);

	count++;

	conn.setEncoding('utf8');

	conn.on('data', function(data) {
		// Remove the "enter character"
		data = data.replace('\r\n', '');

		// If there is no user yet, we consider this someone joining the room
		if (!nickname) {
			if (users[data]) {
				conn.write('\033[93m>' +data+ ' already in use. try again:\033[39m');
				return;
			} else {
				nickname = data;
				 users[nickname] = conn;

				 for (var i in users) {
				 	if (i != nickname) {
					 	users[i].write('\033[90m > ' + nickname + ' joined the room\033[39m\n');
					} else {
						users[i].write('\033[90m > welcome to the chat room, play nice. \n');
					}
				 }
			}
		} else {
		// Otherwise, we should consider this a regular chat message..
			for (var i in users) {
				users[i].write('\033[96m > ' +nickname+ ':\033[39m ' + data + '\n');
				
			}
		}
	});

	conn.on('close', function() {
		count--;

		broadcastLeave(nickname);

		delete users[nickname];
	});

	// Utilities
	function broadcastLeave (username) {
		for (var i in users) {
			if (i != username) {
				users[i].write('> ' +username+ ' has left the room.\n');
			}
		}
	}
});

// Listen
server.listen(3000, function(){
	console.log('\033[96m    server listening on *:3000\033[39m');
});	






