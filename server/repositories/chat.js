const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const config = require("../config.json");
const Chat = require("../models/chat");
const roles = require("../models/roles");
mongoose.connect(config.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
class ChatRepository {
  async startChat(userOne, userTwo, message, date) {
    let chat = new Chat();
    chat.userOne = userOne;
    chat.userTwo = userTwo;
    chat.messages.push({
      date: date,
      message: message,
      sender: userOne,
    });
    chat.isOpen = true;
    chat.save();
    return true;
  }
  async sendMessage(senderId, recieveId, message, date) {
    let chat = await Chat.findOne({ userOne: senderId, userTwo: recieveId });
    if (chat === null) {
      chat = await Chat.findOne({ userTwo: senderId, userOne: recieveId });
      if (chat === null) {
        return false;
      }
    }
    chat.messages.push({
      date: date,
      message: message,
      sender: senderId,
    });
    chat.save();
    return true;
  }
  async checkChatExists(userOne, userTwo) {
    let exists = await Chat.exists({ userOne: userOne, userTwo: userTwo });
    if (!exists) {
      exists = await Chat.exists({ userOne: userTwo, userTwo: userOne });
    }
    return exists;
  }
  async getMessages(userOne, userTwo) {
    let chat = await Chat.findOne({ userOne: userOne, userTwo: userTwo });
    if (chat === null) {
      chat = await Chat.findOne({ userOne: userTwo, userTwo: userOne });
      if (chat === null) {
        return false;
      }
    }
    return chat.messages;
  }
  async getUsersChats(userId) {
    let chats = await Chat.find({ userOne: userId })
      .populate("userTwo")
      .populate("userOne")
      .exec();
    chats = chats.concat(
      await Chat.find({ userTwo: userId })
        .populate("userOne")
        .populate("userTwo")
        .exec()
    );
    let users = [];
    chats.forEach((chat) => {
      if (chat.userOne._id == userId) {
        delete chat.userTwo.password;
        users.push(chat.userTwo);
      } else {
        delete chat.userOne.password;
        users.push(chat.userOne);
      }
    });
    console.log(users);
    return users;
  }
}
module.exports = ChatRepository;
