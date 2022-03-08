const express = require("express");
const router = express.Router();
const VetService = require("../services/vet");
const vetService = new VetService();
const validation = require("../models/validation/validation");
const createScheduleSchema = require("../models/validation/vet/createSchedule");
const createAppointmentSchema = require("../models/validation/vet/createAppointment");
const authenticateVet = require("../authentication/authenticateVet");
const authenticate = require("../authentication/authenticate");
const roles = require("../models/roles");
router.post("/createSchedule", authenticateVet, async (req, res) => {
  validation(req.body, createScheduleSchema(req.body), res, async () => {
    try {
      res.send(await vetService.createSchedule(req.user.id, req.body));
    } catch {
      res.sendStatus(400);
    }
  });
});
router.post("/createAppointment", authenticate, async (req, res) => {
  if (req.user.role !== roles.Vet) {
    validation(req.body, createAppointmentSchema, res, async () => {
      res.send(await vetService.createAppointment(req.user.id, req.body));
    });
  } else {
    res.sendStatus(403);
  }
});
module.exports = router;
