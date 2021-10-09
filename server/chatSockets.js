const authenticate = require("./authentication/authenticateSocket");
const ChatService = require("./services/chat");
module.exports = (io) => {
  let activeUsers = {};
  let chatService = new ChatService();
  const onRequestGetMessages = async function (socket) {
    const senderId = Object.keys(activeUsers).find(
      (key) => activeUsers[key] === socket.id
    );
    let messages = await chatService.getMessages(senderId, socket.getId);
    console.log(true);
    io.to(activeUsers[senderId]).emit("getMessages", {
      id: socket.id,
      getId: socket.getId,
      messages: messages,
    });
  };
  const onNewMessage = async function (socket) {
    const senderId = Object.keys(activeUsers).find(
      (key) => activeUsers[key] === socket.id
    );
    if (activeUsers[socket.recieveId]) {
      io.to(activeUsers[socket.recieveId]).emit("newMessage", {
        msg: socket.msg,
        senderId: senderId,
        date: socket.date,
      });
    }
    await chatService.sendMessage(
      senderId,
      socket.recieveId,
      socket.msg,
      socket.date
    );
  };
  const onConnection = async function (socket) {
    const token = socket.handshake.auth.token;
    const res = await authenticate(token);
    if (res !== false) {
      console.log("connected");
      const users = await chatService.getUsersChats(res.id);
      socket.emit("allChatUsers", { users: users, id: res.id });
      activeUsers[res.id] = socket.id;
      console.log(activeUsers);
      socket.on("newMessage", onNewMessage);
      socket.on("requestGetMessages", onRequestGetMessages);
      socket.on("disconnect", function () {
        const socketId = Object.keys(activeUsers).find(
          (key) => activeUsers[key] === socket.id
        );
        delete activeUsers[socketId];
        console.log(activeUsers);
        console.log("disconnect");
      });
    } else {
      socket.disconnect();
      console.log("disconnected");
    }
  };
  return onConnection;
};
