const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  title: { type: String },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String, required: true },
  mainPhoto: { type: String, required: true },
  photos: { type: [String], required: true },
  documentsForPayment: { type: [String], required: true },
  value: { type: Number, required: true },
  paypalDonationURL: { type: String, required: true },
  moderationVerified: { type: Boolean, default: false, required: true },
  rejectedComment: { type: String, default: "" },
  completed: { type: Boolean, default: false, required: true },
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  expireAt: {
    type: Number,
    default: () => {
      return parseInt(new Date().getTime() / 1000) + 2629743;
    },
  },
});
module.exports = mongoose.model("FundrisingCampaign", schema, "campaigns");
