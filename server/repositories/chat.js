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
    let chat = await Chat.findOne({
      $and: [
        { $or: [{ userOne: senderId }, { userOne: recieveId }] },
        { $or: [{ userTwo: senderId }, { userTwo: recieveId }] },
      ],
    });
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
    return await Chat.exists({
      $and: [
        { $or: [{ userOne: userOne }, { userOne: userTwo }] },
        { $or: [{ userTwo: userOne }, { userTwo: userTwo }] },
      ],
    });
  }
  async getMessages(userOne, userTwo) {
    let chat = await Chat.findOne({
      $and: [
        { $or: [{ userOne: userOne }, { userOne: userTwo }] },
        { $or: [{ userTwo: userOne }, { userTwo: userTwo }] },
      ],
    });
    if (chat !== null) {
      return chat.messages;
    } else {
      return false;
    }
  }
  async seenMessages(userOne, userTwo) {
    let chat = await Chat.findOne({
      $and: [
        { $or: [{ userOne: userOne }, { userOne: userTwo }] },
        { $or: [{ userTwo: userOne }, { userTwo: userTwo }] },
      ],
    });
    if (chat !== null) {
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
    } else {
      return false;
    }
  }
  async deleteChat(userId) {
    try {
      return await Chat.deleteMany({
        $or: [{ userOne: userId }, { userTwo: userId }],
      });
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
