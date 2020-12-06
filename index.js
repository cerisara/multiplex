let http        = require('http');
let express		= require('express');
let fs			= require('fs');
let io			= require('socket.io');
let crypto		= require('crypto');

let app       	= express();
let staticDir 	= express.static;
let server    	= http.createServer(app);

io = io(server);

let opts = {
	port: process.env.PORT || 1948,
	baseDir : process.cwd()
};
console.log("**Socket.IO Version: " + require('socket.io/package').version);
let masterClient = "";
let pollon = false;
io.on( 'connection', socket => {
	console.log("connection, nclients:" + socket.conn.server.clientsCount);
	console.log("clients: ");
	for (let i in socket.conn.server.clients) {
		if (socket.conn.server.clients.hasOwnProperty(i)) {
			console.log(socket.conn.server.clients[i].id);
		}
	}
	console.log("MASTER: "+masterClient);

	if (pollon) {
        // when a (new) client (re-)connect, if there is a poll running, we must show him
		console.log("resend the pollon event to "+socket.id);
		// TODO: check the client ID with its IP, and do not resend if the client has already answered poll
		socket.emit('pollactive',{});
	}

    socket.on('iammaster', data => {
        // this msg is sent only once when the master (re-)connect
		masterClient = socket.id;
        console.log("GOT master " + data.pollvisible);
        if (!data.pollvisible) socket.broadcast.emit('pollclosed', {});
    });
    socket.on('mplexpoll', data => {
        socket.broadcast.emit('mplexpoll', data);
    });

	socket.on('multiplex-statechanged', data => {
		if (typeof data.secret == 'undefined' || data.secret == null || data.secret === '') return;
        // this is the master
		if (data.cmd=="pollactive") pollon=true;
		else if (data.cmd=="pollclosed") pollon=false;
		if (createHash(data.secret) === data.socketId) {
			data.secret = null;
			socket.broadcast.emit(data.socketId, data);
		};
	});
});

app.use( express.static( opts.baseDir ) );

app.get("/", ( req, res ) => {
	res.writeHead(200, {'Content-Type': 'text/html'});

	let stream = fs.createReadStream( opts.baseDir + '/index.html' );
	stream.on('error', error => {
		res.write('<style>body{font-family: sans-serif;}</style><h2>reveal.js multiplex server.</h2><a href="/token">Generate token</a>');
		res.end();
	});
	stream.on('open', () => {
		stream.pipe( res );
	});
});

app.get("/token", ( req, res ) => {
	let ts = new Date().getTime();
	let rand = Math.floor(Math.random()*9999999);
	let secret = ts.toString() + rand.toString();
	res.send({secret: secret, socketId: createHash(secret)});
});

let createHash = secret => {
	let cipher = crypto.createCipher('blowfish', secret);
	return cipher.final('hex');
};

// Actually listen
server.listen( opts.port || null );

let brown = '\033[33m',
	green = '\033[32m',
	reset = '\033[0m';

console.log( brown + "reveal.js:" + reset + " Multiplex running on port " + green + opts.port + reset );
