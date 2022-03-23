"use strict";
const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const validation = require("../models/validation/validation");
const authenticate = require("../authentication/authenticate");
const createFundraisingCampaignSchema = require("../models/validation/fundraisingCampaign/createFundraisingCampaign");
const completeFundraisingCampaignSchema = require("../models/validation/fundraisingCampaign/completeFundraisingCampaign");
const editFundraisingCampaign = require("../models/validation/fundraisingCampaign/editCampaign");
const FundraisingCampaignService = require("../services/fundraisingCampaign");
const authenticateGet = require("../authentication/authenticateGet");
const sendCampaignForVerificationSchema = require("../models/validation/fundraisingCampaign/sendCampaignForVerification");
const fundraisingCampaignService = new FundraisingCampaignService();
router.post("/createFundraisingCampaign", authenticate, async (req, res) => {
  validation(req.body, createFundraisingCampaignSchema, res, async () => {
    req.body.user = req.user.id;
    res.send(
      await fundraisingCampaignService.createFundraisingCampaign(req.body)
    );
  });
});
router.post("/completeFundraisingCampaign", authenticate, async (req, res) => {
  validation(req.body, completeFundraisingCampaignSchema, res, async () => {
    res.send(
      await fundraisingCampaignService.completeFundraisingCampaign(
        req.body.campaignId,
        req.user.id
      )
    );
  });
});
router.post("/sendCampaignForVerification", authenticate, async (req, res) => {
  validation(req.body, sendCampaignForVerificationSchema, res, async () => {
    res.send(
      await fundraisingCampaignService.sendCampaignForVerification(
        req.body.campaignId,
        req.user.id
      )
    );
  });
});
router.get("/getMyCampaigns/:pageNum", authenticate, async (req, res) => {
  try {
    const pageNum = parseInt(req.params.pageNum);
    if (pageNum > 0) {
      res.send(
        await fundraisingCampaignService.getCampaignsByUser(
          req.user.id,
          pageNum
        )
      );
    } else {
      res.sendStatus(400);
    }
  } catch {
    res.sendStatus(400);
  }
});
router.post("/editCampaign/:prop", authenticate, async (req, res) => {
  const schema = editFundraisingCampaign(req.params.prop);
  if (schema !== undefined) {
    validation(req.body, schema, res, async () => {
      switch (req.params.prop) {
        case "mainPhotoDataURL":
          res.send(
            await fundraisingCampaignService.editFundraisingCampaign(
              req.user.id,
              req.body.campaignId,
              req.params.prop,
              req.body
            )
          );
          break;
        default:
          res.send(
            await fundraisingCampaignService.editFundraisingCampaign(
              req.user.id,
              req.body.campaignId,
              req.params.prop,
              req.body[req.params.prop]
            )
          );
          break;
      }
    });
  } else {
    res.sendStatus(400);
  }
});
router.get("/getAllCampaigns/:pageNum/:searchQuery?", async (req, res) => {
  try {
    const pageNum = parseInt(req.params.pageNum);
    if (pageNum > 0) {
      res.send(
        await fundraisingCampaignService.getAllCampaigns(
          req.params.searchQuery,
          pageNum
        )
      );
    } else {
      res.sendStatus(400);
    }
  } catch {
    res.sendStatus(400);
  }
});
router.get("/getMyCampaign/:id", authenticate, async (req, res) => {
  res.send(
    await fundraisingCampaignService.getFundraisingCampaignByUser(
      req.params.id,
      req.user.id
    )
  );
});
router.get("/document/:id/:filename", authenticateGet, async (req, res) => {
  const fileName = req.params.filename;
  let dir = `${path.dirname(require.main.filename)}/documents`;
  if (fs.existsSync(`${dir}/${fileName}`)) {
    if (
      (await fundraisingCampaignService.checkDocument(
        req.params.id,
        req.user.id,
        fileName
      )) === true
    ) {
      res.sendFile(`${dir}/${fileName}`);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(404);
  }
});
router.get("/:id", async (req, res) => {
  res.send(
    await fundraisingCampaignService.getFundraisingCampaign(req.params.id)
  );
});
module.exports = router;
