const mongoose = require("mongoose");
const typeAnimals = require("./typeAnimals");
const typeAppointments = require("./typeAppointments");
const schema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  vet: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  typeAnimal: {
    type: String,
    enum: Object.values(typeAnimals),
    required: true,
  },
  typeAppointment: {
    type: String,
    enum: Object.values(typeAppointments),
    required: true,
  },
  otherInfo: {
    type: String,
  },
  hour: { type: String, required: true },
  date: { type: Date, required: true },
  confirmed: { type: Boolean, default: false },
});
module.exports = mongoose.model("VetAppointment", schema, "vetAppointments");
