const mongoose = require("mongoose");
const config = require("../config.json");
const addToDB = require("./addToDB");
const createCitiesJSON = require("./cities/createCitiesJSON");
const createMunicipalitiesJSON = require("./municipalities/createMunicipalitiesJSON");
const createRegionsJSON = require("./regions/createRegionsJSON");
mongoose.connect(config.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log("Cities are adding...");
const regions = createRegionsJSON();
const municipalities = createMunicipalitiesJSON();
const cities = createCitiesJSON();
addToDB(cities, municipalities, regions).then(() => {
  mongoose.disconnect();
  console.log("Cities added to DB!");
});
