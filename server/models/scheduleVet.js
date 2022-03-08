const mongoose = require("mongoose");
const hourVet = require("./hourVet");
const typeAppointments = require("./typeAppointments");
const schema = new mongoose.Schema({
  mon: { type: [hourVet], required: false },
  tue: { type: [hourVet], required: false },
  wed: { type: [hourVet], required: false },
  thu: { type: [hourVet], required: false },
  fri: { type: [hourVet], required: false },
  sat: { type: [hourVet], required: false },
  sun: { type: [hourVet], required: false },
  typeAppointments: {
    type: [String],
    enum: Object.values(typeAppointments),
    required: true,
  },
});
module.exports = schema;
