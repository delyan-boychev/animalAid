"use strict";
const City = require("../models/city");
const Municipality = require("../models/municipality");
const Region = require("../models/region");
class CityRepository {
  /**
   * Get all regions
   * @returns {Object[]}
   */
  async getAllRegions() {
    return await Region.find();
  }
  /**
   * Get municipalities
   * @param {String} region Region
   * @returns {[]|Boolean}
   */
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
  /**
   * Get cities
   * @param {String} municipality Municipality
   * @returns {[]|Boolean}
   */
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
