"use strict";
const express = require("express");
const router = express.Router();
const validation = require("../models/validation/validation");
const authenticate = require("../authentication/authenticate");
const createFundrisingCampaignSchema = require("../models/validation/fundrisingCampaign/createFundrisingCampaign");
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
module.exports = router;
