import io from 'socket.io-client';

export default class ExecSock {
    constructor(uri) {
        this.uri = uri
        this.io = io.connect(uri);
    }

    static init(execId) {
        sio = new ExecSock('http://localhost:9999/exec').io

        // enter the room of a execution
        sio.on('connect', function(){
            sio.emit('open', execId)
        });
    }
}