'use strict';

const Builder = require('jsonrpc-lite');

class Response {
    /**
     * @param {String | Number} id
     * @param {Socket} socket
     */
    constructor(id, socket) {
        this.id = id;
        this.socket = socket;
    }

    success(payload) {
        this.send(Builder.success(this.id, payload));
    }

    error(error) {
        this.send(Builder.error(this.id, error));
    }

    notify(room, name, payload) {
        this.socket.to(room).emit('rpc', Builder.notification(name, payload));
    }

    /**
     * @private
     */
    send(packet) {
        this.socket.emit('rpc', JSON.stringify(packet));
    }
}

module.exports = Response;
