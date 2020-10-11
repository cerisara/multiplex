(function() {
	var multiplex = Reveal.getConfig().multiplex;
	var socketId = multiplex.id;
	var socket = io.connect(multiplex.url);

	socket.on(multiplex.id, function(data) {
		// ignore data from sockets that aren't ours
		if (data.socketId !== socketId) { return; }
		if( window.location.host === 'localhost:1947' ) return;

        console.log("revealjs "+window.RevealChalkboard.id);
        if (data.cmd === 'state') {
            Reveal.setState(data.state);
        } else if (data.cmd === 'start') {
            if (typeof window.RevealChalkboard !== "undefined") {
                window.RevealChalkboard.draw0(data.xx,data.yy,data.cw,data.rw);
            }
        } else if (data.cmd === 'segm') {
            if (typeof window.RevealChalkboard !== "undefined") {
                window.RevealChalkboard.draw1(data.xx,data.yy,data.cw,data.rw);
            }
        } else if (data.cmd === 'end') {
            if (typeof window.RevealChalkboard !== "undefined") {
                window.RevealChalkboard.draw2(data.xx,data.yy);
            }
        }
	});
}());
