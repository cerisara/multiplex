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
                var canvas = document.getElementById('chalkboard');
                for (i=0;i<canvas.children.length;i++) {
                    e = canvas.children[i];
                    if (e.nodeName=="CANVAS") {
                        e.setAttribute('data-chalkboard',0);
                        var ev = new MouseEvent('mousedown', {
                            'view': window,
                            'bubbles': true,
                            'cancelable': true,
                            'clientX': data.xx,
                            'clientY': data.yy 
                        });
                        e.dispatchEvent(ev);
                        break;
                    }
                }
            }
        } else if (data.cmd === 'segm') {
            if (typeof window.RevealChalkboard !== "undefined") {
                var canvas = document.getElementById('chalkboard');
                for (i=0;i<canvas.children.length;i++) {
                    e = canvas.children[i];
                    if (e.nodeName=="CANVAS") {
                        e.setAttribute('data-chalkboard',0);
                        var ev = new MouseEvent('mousemove', {
                            'view': window,
                            'bubbles': true,
                            'cancelable': true,
                            'clientX': data.xx,
                            'clientY': data.yy 
                        });
                        e.dispatchEvent(ev);
                        break;
                    }
                }
            }
        } else if (data.cmd === 'end') {
            if (typeof window.RevealChalkboard !== "undefined") {
                var canvas = document.getElementById('chalkboard');
                for (i=0;i<canvas.children.length;i++) {
                    e = canvas.children[i];
                    if (e.nodeName=="CANVAS") {
                        e.setAttribute('data-chalkboard',0);
                        var ev = new MouseEvent('mouseup', {
                            'view': window,
                            'bubbles': true,
                            'cancelable': true,
                        });
                        e.dispatchEvent(ev);
                        break;
                    }
                }
            }
        }
	});
}());
