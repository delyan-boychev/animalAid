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
const removeAppointmentSchema = require("../models/validation/vet/removeAppointment");
const confirmAppointmentSchema = require("../models/validation/vet/confirmAppointment");
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
router.get("/getHours/:vetId/:date", authenticate, async (req, res) => {
  if (req.user.role !== roles.Vet) {
    let dateRegex =
      /^(?:(?:31(-)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(-)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(-)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(-)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
    let idRegex = /^[a-f\d]{24}$/;
    if (idRegex.test(req.params.vetId) && dateRegex.test(req.params.date)) {
      res.send(await vetService.getHours(req.params.vetId, req.params.date));
    } else {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(403);
  }
});
router.get("/checkVetAndSchedule", authenticate, async (req, res) => {
  res.send(await vetService.checkVetAndSchedule(req.user.id));
});
router.get("/getAppointments/:date", authenticateVet, async (req, res) => {
  let dateRegex =
    /^(?:(?:31(-)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(-)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(-)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(-)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
  if (dateRegex.test(req.params.date)) {
    res.send(await vetService.getAppointments(req.user.id, req.params.date));
  } else {
    res.sendStatus(400);
  }
});
router.get(
  "/myUpcomingAppointments/:pageNum",
  authenticate,
  async (req, res) => {
    if (req.user.role !== roles.Vet) {
      try {
        const pageNum = parseInt(req.params.pageNum);
        if (pageNum > 0) {
          res.send(
            await vetService.getUpcomingAppointments(req.user.id, pageNum)
          );
        } else {
          res.sendStatus(400);
        }
      } catch {
        res.sendStatus(400);
      }
    } else {
      res.sendStatus(403);
    }
  }
);
router.get("/myPastAppointments/:pageNum", authenticate, async (req, res) => {
  if (req.user.role !== roles.Vet) {
    try {
      const pageNum = parseInt(req.params.pageNum);
      if (pageNum > 0) {
        res.send(await vetService.getPastAppointments(req.user.id, pageNum));
      } else {
        res.sendStatus(400);
      }
    } catch {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(403);
  }
});
router.post("/removeAppointment", authenticate, async (req, res) => {
  if (req.user.role !== roles.Vet) {
    validation(req.body, removeAppointmentSchema, res, async () => {
      res.send(
        await vetService.removeAppointment(req.user.id, req.body.appointmentId)
      );
    });
  } else {
    validation(req.body, removeAppointmentSchema, res, async () => {
      res.send(
        await vetService.removeAppointmentByVet(
          req.user.id,
          req.body.appointmentId
        )
      );
    });
  }
});
router.post("/confirmAppointment", authenticateVet, async (req, res) => {
  validation(req.body, confirmAppointmentSchema, res, async () => {
    res.send(
      await vetService.confirmAppointment(req.user.id, req.body.appointmentId)
    );
  });
});
module.exports = router;
