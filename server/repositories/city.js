"use strict";
const City = require("../models/city");
const Municipality = require("../models/municipality");
const Region = require("../models/region");
class CityRepository {
  async getAllRegions() {
    return await Region.find();
  }
  async getMunicipalitiesByRegion(region) {
    const municipalities = await Municipality.find({
      municipality: { $regex: region },
    });
    if (municipalities !== null) {
      return municipalities;
    } else {
      return false;
    }
  }
  async getCitiesByMunicipality(municipality) {
    const cities = await City.find({ municipality });
    if (cities !== null) {
      return cities;
    } else {
      return false;
    }
  }
}
module.exports = CityRepository;
