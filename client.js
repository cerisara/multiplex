(function() {
	var multiplex = Reveal.getConfig().multiplex;
	var socketId = multiplex.id;
	var socket = io.connect(multiplex.url);

    function keyp(c) {
        var keyboardEvent = document.createEvent("KeyboardEvent");
        var initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";
        keyboardEvent[initMethod](
          "keydown", // event type: keydown, keyup, keypress
          true,      // bubbles
          true,      // cancelable
          window,    // view: should be window
          false,     // ctrlKey
          false,     // altKey
          false,     // shiftKey
          false,     // metaKey
          40,        // keyCode: unsigned long - the virtual key code, else 0
          0          // charCode: unsigned long - the Unicode character associated with the depressed key, else 0
        );
        document.dispatchEvent(keyboardEvent);
    }

    function myinit() {
        var message = new CustomEvent('received');
        message.content = { sender: 'chalkboard-plugin', type: 'newclient' };
        document.dispatchEvent( message );
    }
	window.addEventListener( 'load', myinit );

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
        } else if (data.cmd === 'end') {
            if (typeof window.RevealChalkboard !== "undefined") {
                var message = new CustomEvent('received');
                message.content = { sender: 'chalkboard-plugin', type: 'stopDrawing', erase: false};
                document.dispatchEvent( message );
            }
        }
	});
}());
