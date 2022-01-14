const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  expireAt: {
    type: Date,
    required: true,
    default: () => {
      return new Date(new Date().valueOf() + 600000);
    },
  },
  captcha: { type: String, required: true },
  captchaCode: { type: String, required: true },
});
schema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
module.exports = mongoose.model("Captcha", schema);
