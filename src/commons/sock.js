import io from 'socket.io-client';
import API from "@/commons/api";
// import store from '@/store'


export default class SocketChannel {

    static EXEC = new SocketChannel('/exec', (sio, answer) => {
        console.log('listen on executing: ' + answer)
    }, (sio, update) => {
        console.log('get executing event: ' + JSON.stringify(update))
        const execId = update['flow-id']
        API.LOAD_EXEC.issue({ id: execId }).then(response => {
            let executing = {}
            for (let t of response.data.exec.tasks) {
              executing[t['task']] = t['status']
            }
            executing[response.data.flow.name] = response.data.exec.flow['status']
            vm.$store.commit("updateExecuting", {
                id: execId,
                data: executing
            })
          });  
    });

    constructor(namespace, on_reply, on_update) {
        this.namespace = namespace;
        this.on_reply = on_reply;
        this.on_update = on_update;
    }

    open(query) {
        const socket = io.connect('http://localhost:9999' + this.namespace)
        socket.on('connect', function () {
            socket.emit('query', query)
        });

        socket.on('reply', (answer) => {
            this.on_reply(socket, answer)
        });

        socket.on('update', (update) => {
            this.on_update(socket, update)
        });
    }
}