const authenticate = require("./authentication/authenticateSocket");
const ChatService = require("./services/chat");
module.exports = (io) => {
  let activeUsers = {};
  let chatService = new ChatService();
  const onRequestGetAllChatUsers = async function (socket) {
    const senderId = Object.keys(activeUsers).find(
      (key) => activeUsers[key] === socket.id
    );
    const users = await chatService.getUsersChats(senderId);
    io.to(socket.id).emit("allChatUsers", { users: users, id: senderId });
  };
  const onSeenMessages = async function (socket) {
    const senderId = Object.keys(activeUsers).find(
      (key) => activeUsers[key] === socket.id
    );
    await chatService.seenMessages(senderId, socket.recieveId);
  };
  const onRequestGetMessages = async function (socket) {
    const senderId = Object.keys(activeUsers).find(
      (key) => activeUsers[key] === socket.id
    );
    let messages = await chatService.getMessages(senderId, socket.getId);
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
    await chatService.sendMessage(
      senderId,
      socket.recieveId,
      socket.msg,
      socket.date
    );
    if (activeUsers[socket.recieveId]) {
      io.to(activeUsers[socket.recieveId]).emit("newMessage", {
        msg: socket.msg,
        senderId: senderId,
        date: socket.date,
      });
    }
  };
  const onConnection = async function (socket) {
    const token = socket.handshake.auth.token;
    const res = await authenticate(token);
    if (res !== false) {
      const users = await chatService.getUsersChats(res.id);
      socket.emit("allChatUsers", { users: users, id: res.id });
      activeUsers[res.id] = socket.id;
      socket.on("newMessage", onNewMessage);
      socket.on("requestGetMessages", onRequestGetMessages);
      socket.on("requestGetAllChatUsers", onRequestGetAllChatUsers);
      socket.on("seenMessages", onSeenMessages);
      socket.on("disconnect", function () {
        const socketId = Object.keys(activeUsers).find(
          (key) => activeUsers[key] === socket.id
        );
        delete activeUsers[socketId];
      });
    } else {
      socket.disconnect();
    }
  };
  return onConnection;
};
