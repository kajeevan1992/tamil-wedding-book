const { Server } = require("socket.io");

const setupSokcetIo = (server) => {
    const io = new Server(server);
    io.on('connection', (socket) => {
        socket.on("preferredByBusiness", (data) => {
            data.online = true;
            socket.broadcast.emit(`preferredByBusiness-${data.userId}`, data)
        });
        // todo setup the reactjs socketio
        // socket.on('event', (data) => { /* … */ });
        // socket.on('disconnect', () => { /* … */ });
    });
}

module.exports = setupSokcetIo;

