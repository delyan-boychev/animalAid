const mongoose = require("mongoose");
const roles = require("./roles");
const typeAnimals = require("./typeAnimals");
const schema = new mongoose.Schema({
  name: {
    first: { type: String, required: true },
    last: { type: String, required: true },
  },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  city: { type: mongoose.SchemaTypes.ObjectId, ref: "City", required: true },
  password: { type: String, required: true },
  createdOn: {
    type: Number,
    required: true,
    default: parseInt(new Date().getTime().toString()),
  },
  role: {
    type: String,
    required: true,
    enum: [roles.Admin, roles.Moderator, roles.User, roles.Vet],
  },
  typeAnimals: {
    type: [String],
    default: undefined,
    required: () => {
      return this.role === roles.Vet;
    },
    enum: [
      typeAnimals.Cats,
      typeAnimals.Dogs,
      typeAnimals.ExoticAnimals,
      typeAnimals.Birds,
    ],
  },
  vetDescription: {
    type: String,
    required: () => {
      return this.role === roles.Vet;
    },
  },
  URN: {
    type: String,
    required: () => {
      return this.role === roles.Vet;
    },
  },
  address: {
    type: String,
    required: () => {
      return this.role === roles.Vet;
    },
  },
  imgFileName: { type: String, required: true },
  verified: { type: Boolean, required: true },
  moderationVerified: {
    type: Boolean,
    required: () => {
      return this.role === roles.Vet;
    },
  },
  lastForgotPassword: Number,
  lastRequestForgotPassword: Number,
});
module.exports = mongoose.model("User", schema);
