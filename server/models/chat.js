const mongoose = require("mongoose");
const Message = require("./message");
const schema = new mongoose.Schema({
  userOne: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  userTwo: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  isOpen: Boolean,
  messages: [Message],
  createdAt: { type: Date, expires: 2629744, default: Date.now },
});
module.exports = mongoose.model("Chat", schema);
