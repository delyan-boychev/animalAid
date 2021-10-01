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
  async startChat(userId, vetId, message) {
    let chat = new Chat();
    chat.sender = userId;
    chat.recipient = vetId;
    chat.messages.push({
      date: new Date().getTime() / 1000,
      message: message,
      sender: userId,
    });
    chat.isOpen = true;
    return true;
  }
}
