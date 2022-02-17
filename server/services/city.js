"use strict";
const CityRepository = require("../repositories/city");
class CityService {
  #cityRepository = new CityRepository();
  /**
   * Get all regions
   * @returns {Object[]}
   */
  async getAllRegions() {
    return this.#cityRepository.getAllRegions();
  }
  /**
   * Get municipalities by region
   * @param {String} region
   * @returns {Object[]}
   */
  async getMunicipalitiesByRegion(region) {
    return await this.#cityRepository.getMunicipalitiesByRegion(region);
  }
  /**
   * Get cities by municipality
   * @param {String} municipality
   * @returns {Object[]}
   */
  async getCitiesByMunicipality(municipality) {
    return await this.#cityRepository.getCitiesByMunicipality(municipality);
  }
}
module.exports = CityService;
