(function() {
	var multiplex = Reveal.getConfig().multiplex;
	var socketId = multiplex.id;
	var socket = io.connect(multiplex.url);

	socket.on(multiplex.id, function(data) {
		// ignore data from sockets that aren't ours
		if (data.socketId !== socketId) { return; }
		if( window.location.host === 'localhost:1947' ) return;

        if (data.cmd === 'state') {
            Reveal.setState(data.state);
        } else if (data.cmd === 'start') {
            if (typeof window.RevealChalkboard !== "undefined") {
                var message = new CustomEvent('received');
                message.content = { sender: 'chalkboard-plugin', type: 'startDrawing', x: data.xx, y: data.yy, erase: false};
                document.dispatchEvent( message );
            }
        } else if (data.cmd === 'segm') {
            if (typeof window.RevealChalkboard !== "undefined") {
                var message = new CustomEvent('received');
                message.content = { sender: 'chalkboard-plugin', type: 'drawSegment', x: data.xx, y: data.yy, erase: false};
                document.dispatchEvent( message );
            }
        } else if (data.cmd === 'init') {
            if (typeof window.RevealChalkboard !== "undefined") {
                var message = new CustomEvent('received');
                message.content = { sender: 'chalkboard-plugin', type: 'init', storage: data.sto};
                document.dispatchEvent( message );
                console.log("client sent storage to chalkboard");
            }
        } else if (data.cmd === 'end') {
            if (typeof window.RevealChalkboard !== "undefined") {
                var message = new CustomEvent('received');
                message.content = { sender: 'chalkboard-plugin', type: 'stopDrawing', erase: false};
                document.dispatchEvent( message );
            }
        }
	});
}());
