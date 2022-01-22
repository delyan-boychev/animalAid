"use strict";
const express = require("express");
const router = express.Router();
const CityService = require("../services/city");
const cityService = new CityService();
router.get("/getAllRegions", async (req, res) => {
  res.send(await cityService.getAllRegions());
});
router.get("/getMunicipalitiesByRegion/:region", async (req, res) => {
  if (req.params.region !== undefined) {
    res.send(await cityService.getMunicipalitiesByRegion(req.params.region));
  }
});
router.get("/getCitiesByMunicipality/:municipality", async (req, res) => {
  if (req.params.municipality !== undefined) {
    res.send(
      await cityService.getCitiesByMunicipality(req.params.municipality)
    );
  }
});
module.exports = router;
