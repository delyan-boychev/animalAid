const mongoose = require("mongoose");
const Message = require("./message");
const schema = new mongoose.Schema({
  expireAt: {
    type: Date,
    required: true,
    default: () => {
      return new Date(new Date().valueOf() + 1209600000);
    },
  },
  userOne: { type: mongoose.SchemaTypes.ObjectId, ref: "User", required: true },
  userTwo: { type: mongoose.SchemaTypes.ObjectId, ref: "User", required: true },
  messages: [Message],
});
schema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
module.exports = mongoose.model("Chat", schema);
