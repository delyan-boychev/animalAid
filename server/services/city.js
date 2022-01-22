"use strict";
const CityRepository = require("../repositories/city");
class CityService {
  #cityRepository = new CityRepository();
  async getAllRegions() {
    return this.#cityRepository.getAllRegions();
  }
  async getMunicipalitiesByRegion(region) {
    return await this.#cityRepository.getMunicipalitiesByRegion(region);
  }
  async getCitiesByMunicipality(municipality) {
    return await this.#cityRepository.getCitiesByMunicipality(municipality);
  }
}
module.exports = CityService;
