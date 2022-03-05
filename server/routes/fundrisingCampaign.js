"use strict";
const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const validation = require("../models/validation/validation");
const authenticate = require("../authentication/authenticate");
const createFundrisingCampaignSchema = require("../models/validation/fundrisingCampaign/createFundrisingCampaign");
const completeFundrisingCampaignSchema = require("../models/validation/fundrisingCampaign/completeFundrisingCampaign");
const editFundrisingCampaign = require("../models/validation/fundrisingCampaign/editCampaign");
const FundrisingCampaignService = require("../services/fundrisingCampaign");
const authenticateGet = require("../authentication/authenticateGet");
const sendCampaignForVerificationSchema = require("../models/validation/fundrisingCampaign/sendCampaignForVerification");
const fundrisingCampaignService = new FundrisingCampaignService();
router.post("/createFundrisingCampaign", authenticate, async (req, res) => {
  validation(req.body, createFundrisingCampaignSchema, res, async () => {
    req.body.user = req.user.id;
    res.send(
      await fundrisingCampaignService.createFundrisingCampaign(req.body)
    );
  });
});
router.post("/completeFundrisingCampaign", authenticate, async (req, res) => {
  validation(req.body, completeFundrisingCampaignSchema, res, async () => {
    res.send(
      await fundrisingCampaignService.completeFundrisingCampaign(
        req.body.campaignId,
        req.user.id
      )
    );
  });
});
router.post("/sendCampaignForVerification", authenticate, async (req, res) => {
  validation(req.body, sendCampaignForVerificationSchema, res, async () => {
    res.send(
      await fundrisingCampaignService.sendCampaignForVerification(
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
        await fundrisingCampaignService.getCampaignsByUser(req.user.id, pageNum)
      );
    } else {
      res.sendStatus(400);
    }
  } catch {
    res.sendStatus(400);
  }
});
router.post("/editCampaign/:prop", authenticate, async (req, res) => {
  const schema = editFundrisingCampaign(req.params.prop);
  if (schema !== undefined) {
    validation(req.body, schema, res, async () => {
      switch (req.params.prop) {
        case "mainPhotoDataURL":
          res.send(
            await fundrisingCampaignService.editFundrisingCampaign(
              req.user.id,
              req.body.campaignId,
              req.params.prop,
              req.body
            )
          );
          break;
        default:
          res.send(
            await fundrisingCampaignService.editFundrisingCampaign(
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
        await fundrisingCampaignService.getAllCampaigns(
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
    await fundrisingCampaignService.getFundrisingCampaignByUser(
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
      (await fundrisingCampaignService.checkDocument(
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
    await fundrisingCampaignService.getFundrisingCampaign(req.params.id)
  );
});
module.exports = router;
