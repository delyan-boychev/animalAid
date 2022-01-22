const City = require("../models/city");
const Municipality = require("../models/municipality");
const Region = require("../models/region");
const addToDB = async (cities, municipalities, regions) => {
  await City.deleteMany();
  await Municipality.deleteMany();
  await Region.deleteMany();
  await City.insertMany(cities);
  await Municipality.insertMany(municipalities);
  await Region.insertMany(regions);
};
module.exports = addToDB;
