(function() {
	var multiplex = Reveal.getConfig().multiplex;
	var socketId = multiplex.id;
	var socket = io.connect(multiplex.url);

	socket.on(multiplex.id, function(data) {
		// ignore data from sockets that aren't ours
		if (data.socketId !== socketId) { return; }
		if( window.location.host === 'localhost:1947' ) return;

        console.log("got "+data.cmd);
        if (data.cmd === 'state') {
            Reveal.setState(data.state);
        } else if (data.cmd === 'start') {
            console.log("startdrawing ? "+ typeof startDrawing);
            if (typeof startDrawing === "function") {
                startDrawing(x,y,false);
            }
        } else if (data.cmd === 'segm') {
            if (typeof drawSegment === "function") {
                drawSegment(x,y,false);
            }
        }
	});
}());
