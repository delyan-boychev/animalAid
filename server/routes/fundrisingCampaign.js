"use strict";
const express = require("express");
const router = express.Router();
const validation = require("../models/validation/validation");
const authenticate = require("../authentication/authenticate");
const createFundrisingCampaignSchema = require("../models/validation/fundrisingCampaign/createFundrisingCampaign");
const completeFundrisingCampaignSchema = require("../models/validation/fundrisingCampaign/completeFundrisingCampaign");
const FundrisingCampaignService = require("../services/fundrisingCampaign");
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
router.get("/getFundrisingCampaign/:id", async (req, res) => {
  res.send(
    await fundrisingCampaignService.getFundrisingCampaign(req.params.id)
  );
});
module.exports = router;
