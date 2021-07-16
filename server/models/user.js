const mongoose = require('mongoose');
const schema = new mongoose.Schema({ name: {first: String, last:String}, email: String, phoneNumber: String, city: String, password:String, createdOn: Number, role:String, diplomaFile: String, address: String});
module.exports = mongoose.model("User", schema);