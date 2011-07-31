var X3D = X3D ? X3D : new Object();

/*
 * this object represents the communication interface
 * to the communication layer
 *
 * author: simon
 */
X3D.ws = function() {
    var wsuri = "ws://localhost:64365/websession";
    var ws, log, logname = "lib/comm.js";
    var p = {}, status = -1;
    var reconnect = true;
    var timer = null

    /* This was taken from the standards specification. We don't use CLOSING
     * http://dev.w3.org/html5/websockets/#the-websocket-interface */
    const CONNECTING = 0;
    const OPEN       = 1;
    const CLOSING    = 2;
    const CLOSED     = 3;

    const RECONNECT_INTERVAL = 500;

    /*
     * connects to the websocket and subscribes the data event
     * which is used to notify the communication interface to
     * send data
     */
    this.init = function() {
        log = X3D.log.get(logname);

        // register send callback
        X3D.em.subscribe("data", function(data) { p.doSend(data); });

        log.info("initialized");
        this.connect();
    }

    /*
     * connects to the given websocket and sets up callbacks
     */
    this.connect = function () {
        ws = new WebSocket(wsuri, "xml3d");

        if (!timer) log.info("connecting to "+wsuri);

        status = CONNECTING;
        ws.onopen = function (event) { p.onOpen(event); };
        ws.onclose = function (event) { p.onClose(event); };
        ws.onmessage = function (event) { p.onMessage(event); }
        ws.onerror = function (event) { p.onError(event); };
    }

    /*
     * toggles the current connection
     */
    this.toggle = function() {
        if (status == OPEN) {
            log.info("disconnecting on purpose");
            reconnect = false;
            ws.close();
        } else if (status == CLOSED) {
            reconnect = true;
            connect();
        }
    }

    /*
     * if connection was established, publishes the connected event
     * to inform possible subscribers
     */
    p.onOpen = function(event) {
        status = OPEN;
        timer = null;
        X3D.em.publish("connected", true);
		X3D.dia.hm('box');
        log.info("connection created");
    }

    /*
     * emits the disconnect event and tries to reconnect if the
     * disconnect was not on purpose
     */
    p.onClose = function(event) {
        status = CLOSED;
        X3D.em.publish("connected", false);
		X3D.main.noConnectionDialog();

        if (!timer) log.warn("connection closed");

        if (reconnect) {
            if (!timer) log.info("trying to reconnect");
            timer = setTimeout(connect, RECONNECT_INTERVAL);
        }
    }

    /*
     * receives messages from the communication layer and processes
     * them accordingly. messages are usually forwarded to X3D.main
     */
    p.onMessage = function(event) {
        X3D.em.publish("received", event.data);
        log.info("received msg "+event.data);
        var obj = JSON.parse(event.data);
        log.debug("xml3d lib: "+org.xml3d);

        switch (obj.actionType) {
            /*
             * we support three update messages: shader, translation, rotation
             * scale is not yet supported
             */
            case 'update':
                log.debug("received update message");
				log.info("type: "+obj.updateType+" key: "+obj.fieldName+" value: "+obj.value);
                switch(obj.updateType) {
                case 'shader':
					X3D.shader.changeShader2(obj.elementId, obj.fieldName, obj.value);
                    break;
                case 'translation':
                    //var element = document.getElementById(X3D.main.getTransformerPrefix()+obj.elementId);
                    if (obj.fieldName != "x" && obj.fieldName != "y" && obj.fieldName != "z") {
                        log.error("unknown transformer translation in update message");
                        return;
                    }
					X3D.move.changeTransformerTranslation(obj.elementId, obj.fieldName, obj.value);
				    break;
                case 'rotation':
                    //var element = document.getElementById(X3D.main.getTransformerPrefix()+obj.elementId);
                    if (obj.fieldName != "abs") {
                        log.error("unknown transformer rotation axis in update message");
                        return;
                    }
                    X3D.move.changeTransformerRotation(obj.elementId, obj.fieldName, obj.value);
                    break;
                case 'scale':
                    log.warn("scale update message not implemented yet, stub");
                    return;
                default: log.error("unknown update message"); return;
                }

                break;

            /*
             * handles the creation event and asks X3D.main to create the
             * appropriate object using our generics library
             */
            case 'creation':
                log.debug("creation stub");
				X3D.room.checkForWalls(obj.elementId, obj.genericId);

                // generic element
                var newElement = X3D.main.createElementFromGeneric(obj.elementId, obj.groupId, obj.genericId, 0, 0, 0, obj.parentId, false);
                var transformerName = X3D.move.getTransformerPrefix()+newElement;

                // transformer
                var transformer = document.getElementById(transformerName);
                log.debug("found transformer: "+transformer);
                if (obj.translation != null)
				var ints = obj.translation.split(" ");
				transformer.translation.x+=parseFloat(ints[0]);
				transformer.translation.y+=parseFloat(ints[1]);
				transformer.translation.z+=parseFloat(ints[2]);

                if (obj.rotation != null)
                    transformer.setAttribute("rotation", obj.rotation);
                if (obj.scale != null)
                    transformer.setAttribute("scale", obj.scale);

                log.debug("obj created");

                break;

            case 'delete':
                X3D.main.deleteElementById(obj.elementId);
                break;
			case 'lockGranted':
                X3D.main.lockElement(obj.elementId);
                break;
			case 'lockDenied':
                alert('Your requested lock for the element was denied!');
                break;
        }
    }

    /*
     * if an error occured during the websocket communication, log it.
     */
    p.onError = function(event) {
        X3D.em.publish("error", event.data);
        log.error(event.data);
    }

    /*
     * if the connection is open, data that is received using the
     * pubsub event is forwarded to the communication layer.
     */
    p.doSend = function(data) {
    	if (status != OPEN) {
    	  log.warn("could not send data, discarding");
    	  return false;
    	}
		//alert(JSON.stringify(data));
        ws.send(JSON.stringify(data));
        //X3D.em.publish("sent", JSON.stringify(data));
        log.info("sent "+JSON.stringify(data));
        return true;
    }

    return this;
}();
