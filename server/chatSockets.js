const authenticate = require("./authentication/authenticateSocket");
const ChatService = require("./services/chat");
module.exports = (io) => {
  let activeUsers = {};
  let chatService = new ChatService();
  const onRequestGetAllChatUsers = async function (socket) {
    const senderId = activeUsers[socket.id];
    const users = await chatService.getUsersChats(senderId);
    if (users !== false) {
      io.to(socket.id).emit("allChatUsers", { users: users, id: senderId });
    }
  };
  const onSeenMessages = async function (socket) {
    const senderId = activeUsers[socket.id];
    await chatService.seenMessages(senderId, socket.recieveId);
  };
  const onRequestGetMessages = async function (socket) {
    const senderId = activeUsers[socket.id];
    const messages = await chatService.getMessages(
      senderId,
      socket.getId,
      socket.numPage
    );
    if (messages !== false) {
      if (socket.numPage > 1) {
        io.to(socket.id).emit("getMessagesNextPage", {
          id: socket.id,
          messages: messages.messages,
          numPages: messages.numPages,
        });
      } else {
        const user = await chatService.getProfile(socket.getId);
        user["activeStatus"] = false;
        if (
          Object.keys(activeUsers).find(
            (key) => activeUsers[key] === socket.getId
          )
        ) {
          user["activeStatus"] = true;
        }
        io.to(socket.id).emit("getMessages", {
          id: socket.id,
          user: user,
          messages: messages.messages,
          numPages: messages.numPages,
        });
      }
    }
  };
  const onSendImage = async function (socket) {
    const senderId = activeUsers[socket.id];
    const image = await chatService.sendImage(
      senderId,
      socket.recieveId,
      socket.imageData,
      socket.date,
      () => {
        onRequestGetMessages({
          id: socket.id,
          getId: socket.recieveId,
          numPage: 1,
        });
      }
    );
    if (image !== false) {
      let socketIds = Object.keys(activeUsers).filter(
        (key) => activeUsers[key] === socket.recieveId
      );
      if (socketIds.length > 0) {
        socketIds.forEach((socketId) => {
          io.to(socketId).emit("newMessage", {
            image,
            msg: "Изображение",
            senderId: senderId,
            date: socket.date,
          });
        });
      }
    }
  };
  const onNewMessage = async function (socket) {
    const senderId = activeUsers[socket.id];
    const message = await chatService.sendMessage(
      senderId,
      socket.recieveId,
      socket.msg,
      socket.date,
      socket.startChat
    );
    if (message !== false) {
      let socketIds = Object.keys(activeUsers).filter(
        (key) => activeUsers[key] === socket.recieveId
      );
      onRequestGetMessages({
        id: socket.id,
        getId: socket.recieveId,
        numPage: 1,
      });
      if (socketIds.length > 0) {
        socketIds.forEach((socketId) => {
          io.to(socketId).emit("newMessage", {
            msg: socket.msg,
            senderId: senderId,
            date: socket.date,
          });
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
      activeUsers[socket.id] = res.id;
      io.emit("changeActiveStatus", { userId: res.id, activeStatus: true });
      socket.on("sendImage", onSendImage);
      socket.on("newMessage", onNewMessage);
      socket.on("requestGetMessages", onRequestGetMessages);
      socket.on("requestGetAllChatUsers", onRequestGetAllChatUsers);
      socket.on("seenMessages", onSeenMessages);
      socket.on("disconnect", function () {
        const uId = activeUsers[socket.id];
        delete activeUsers[socket.id];
        io.emit("changeActiveStatus", { userId: uId, activeStatus: false });
      });
    } else {
      socket.emit("invalidToken", "");
      socket.disconnect();
    }
  };
  return onConnection;
};
