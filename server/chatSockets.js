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
    if (users !== false) {
      io.to(socket.id).emit("allChatUsers", { users: users, id: senderId });
    }
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
    const messages = await chatService.getMessages(
      senderId,
      socket.getId,
      socket.numPage
    );
    if (messages !== false) {
      if (socket.numPage > 1) {
        io.to(activeUsers[senderId]).emit("getMessagesNextPage", {
          id: socket.id,
          messages: messages.messages,
          numPages: messages.numPages,
        });
      } else {
        const user = await chatService.getProfile(socket.getId);
        user["activeStatus"] = false;
        if (activeUsers[socket.getId]) {
          user["activeStatus"] = true;
        }
        io.to(activeUsers[senderId]).emit("getMessages", {
          id: socket.id,
          user: user,
          messages: messages.messages,
          numPages: messages.numPages,
        });
      }
    }
  };
  const onNewMessage = async function (socket) {
    const senderId = Object.keys(activeUsers).find(
      (key) => activeUsers[key] === socket.id
    );
    const message = await chatService.sendMessage(
      senderId,
      socket.recieveId,
      socket.msg,
      socket.date,
      socket.startChat
    );
    if (message !== false) {
      if (activeUsers[socket.recieveId]) {
        io.to(activeUsers[socket.recieveId]).emit("newMessage", {
          msg: socket.msg,
          senderId: senderId,
          date: socket.date,
        });
      }
    }
  };
  const onConnection = async function (socket) {
    const token = socket.handshake.auth.token;
    const res = await authenticate(token);
    if (res !== false) {
      const users = await chatService.getUsersChats(res.id);
      socket.emit("allChatUsers", { users: users, id: res.id });
      activeUsers[res.id] = socket.id;
      io.emit("changeActiveStatus", { userId: res.id, activeStatus: true });
      socket.on("newMessage", onNewMessage);
      socket.on("requestGetMessages", onRequestGetMessages);
      socket.on("requestGetAllChatUsers", onRequestGetAllChatUsers);
      socket.on("seenMessages", onSeenMessages);
      socket.on("disconnect", function () {
        const uId = Object.keys(activeUsers).find(
          (key) => activeUsers[key] === socket.id
        );
        delete activeUsers[uId];
        io.emit("changeActiveStatus", { userId: uId, activeStatus: false });
      });
    } else {
      socket.emit("invalidToken", "");
      socket.disconnect();
    }
  };
  return onConnection;
};
