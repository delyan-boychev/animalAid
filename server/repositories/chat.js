"use strict";
const Chat = require("../models/chat");
const extMethods = require("../extensionMethods");
class ChatRepository {
  /**
   * Start chat
   * @param {String} userOne User One id
   * @param {String} userTwo User Two id
   * @param {String} message Message
   * @param {Number} date Date of sending message
   * @returns {Boolean}
   */
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
  /**
   * Send message
   * @param {String} senderId Sender id
   * @param {String} recieveId Recieve id
   * @param {String} message Message
   * @param {Number} date Date of sending message
   * @returns {Boolean}
   */
  async sendMessage(senderId, recieveId, message, date) {
    try {
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
      await chat.save();
      return true;
    } catch {
      return false;
    }
  }
  /**
   * Check chat exists
   * @param {String} userOne User One id
   * @param {String} userTwo User Two id
   * @returns {Boolean}
   */
  async checkChatExists(userOne, userTwo) {
    try {
      return await Chat.exists({
        $and: [
          { $or: [{ userOne: userOne }, { userOne: userTwo }] },
          { $or: [{ userTwo: userOne }, { userTwo: userTwo }] },
        ],
      });
    } catch {
      return false;
    }
  }
  /**
   * Get messages
   * @param {String} userOne User One id
   * @param {String} userTwo User Two id
   * @returns {[]|Boolean}
   */
  async getMessages(userOne, userTwo) {
    try {
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
    } catch {
      return false;
    }
  }
  /**
   * Seen messages
   * @param {String} userOne User One id
   * @param {String} userTwo User Two id
   * @returns {Boolean}
   */
  async seenMessages(userOne, userTwo) {
    try {
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
        await chat.save();
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }
  /**
   * Delete chat
   * @param {String} userId User id
   * @returns {Boolean}
   */
  async deleteChat(userId) {
    try {
      return await Chat.deleteMany({
        $or: [{ userOne: userId }, { userTwo: userId }],
      });
    } catch {
      return false;
    }
  }
  /**
   * Get chats by user id
   * @param {String} userId User id
   * @returns {Object[]}
   */
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
