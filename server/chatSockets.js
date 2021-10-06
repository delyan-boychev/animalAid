const authenticate = require("./authentication/authenticateSocket");
module.exports = (io) => {
  let activeUsers = {};
  const onNewMessage = async function (socket) {
    console.log(socket);
    console.log(activeUsers[socket.id]);
    io.to(socket.recieveId).emit("newMessage", socket.msg);
  };
  const onConnection = async function (socket) {
    const token = socket.handshake.auth.token;
    const res = await authenticate(token);
    if (res !== false) {
      console.log("connected");
      socket.emit("newMessage", "test2");
      console.log(socket.id);
      activeUsers[res.id] = socket.id;
      socket.on("newMessage", onNewMessage);
    } else {
      socket.disconnect();
      console.log("disconnected");
      socket.emit("newMessage", "test");
    }
  };
  const onDisconnect = async function (socket) {
    activeUsers.find((element) => (element = socket.id));
  };
  return onConnection;
};
