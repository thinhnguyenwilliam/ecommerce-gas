const chatModel = require("./src/models/chat.model");

const setupSocket = (io) => {
    io.on('connection', (socket) => {

        console.log(`🟢 Client connected: ${socket.id}`);

        socket.on('chat message', async (msg) => {
            //console.log(`💬 Message: ${msg}`);
            console.log(msg);

            // Save to MongoDB
            const dataChat = new chatModel({
                userId: msg.userId || "12345",
                content: msg || 'Anonymous'
            });

            await dataChat.save();

            io.emit('chat message', dataChat); // broadcast to all
        });

        socket.on('disconnect', () => {
            console.log(`🔴 Client disconnected: ${socket.id}`);
        });

    });
};

module.exports = setupSocket;
