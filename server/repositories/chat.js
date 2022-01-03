"use strict";
const Chat = require("../models/chat");
const extMethods = require("../extensionMethods");
class ChatRepository {
  async startChat(userOne, userTwo, message, date) {
    let chat = new Chat();
    chat.userOne = userOne;
    chat.userTwo = userTwo;
    chat.messages.push({
      date: date,
      seen: false,
      message: message,
      sender: userOne,
    });
    try {
      await chat.save();
      return true;
    } catch {
      return false;
    }
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
      seen: false,
      message: message,
      sender: senderId,
    });
    try {
      await chat.save();
      return true;
    } catch {
      return false;
    }
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
  async seenMessages(userOne, userTwo) {
    let chat = await Chat.findOne({ userOne: userOne, userTwo: userTwo });
    if (chat === null) {
      chat = await Chat.findOne({ userOne: userTwo, userTwo: userOne });
      if (chat === null) {
        return false;
      }
    }
    let indexes = extMethods.getAllIndexes(chat.messages, "seen", false);
    indexes.forEach((i) => {
      if (chat.messages[i]["sender"] != userOne) {
        chat.messages[i]["seen"] = true;
      }
    });
    try {
      await chat.save();
      return true;
    } catch {
      return false;
    }
  }
  async getUsersChats(userId) {
    let chats = await Chat.find({ userOne: userId })
      .populate("userTwo")
      .populate("userOne")
      .lean()
      .exec();
    chats = chats.concat(
      await Chat.find({ userTwo: userId })
        .populate("userOne")
        .populate("userTwo")
        .lean()
        .exec()
    );
    let users = [];
    chats.forEach((chat) => {
      chat.userOne.password = undefined;
      chat.userTwo.password = undefined;
      if (chat.userOne._id == userId) {
        const u = chat.userTwo;
        u.lastMessageDate = chat.messages[chat.messages.length - 1]["date"];
        u["seenMessages"] =
          chat.messages[chat.messages.length - 1]["sender"] != userId
            ? chat.messages[chat.messages.length - 1]["seen"]
            : true;
        users.push(u);
      } else {
        const u2 = chat.userOne;
        u2.lastMessageDate = chat.messages[chat.messages.length - 1]["date"];
        u2["seenMessages"] =
          chat.messages[chat.messages.length - 1]["sender"] != userId
            ? chat.messages[chat.messages.length - 1]["seen"]
            : true;
        users.push(u2);
      }
    });
    return users.sort((a, b) => b.lastMessageDate - a.lastMessageDate);
  }
}
module.exports = ChatRepository;
