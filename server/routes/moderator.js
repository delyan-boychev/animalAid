"use strict";
const fs = require("fs");
const path = require("path");
const express = require("express");
const authenticateModerator = require("../authentication/authenticateModerator");
const authenticateGetModerator = require("../authentication/authenticateGetModerator");
const validation = require("../models/validation/validation");
const moderationVerifyVetSchema = require("../models/validation/moderator/moderationVerifyVet");
const deleteThreadSchema = require("../models/validation/moderator/deleteThread");
const deleteThreadPostSchema = require("../models/validation/moderator/deleteThreadPost");
const ModeratorService = require("../services/moderator");
const moderatorService = new ModeratorService();
const roles = require("../models/roles");
const completeFundrisingCampaignSchema = require("../models/validation/moderator/completeFundrisingCampaign");
const moderationVerifyCampaignSchema = require("../models/validation/moderator/moderationVerifyFundrisingCampaign");
const router = express.Router();
router.get(
  "/getAllUsers/:pageNum/:searchQuery?",
  authenticateModerator,
  async (req, res) => {
    try {
      const pageNum = parseInt(req.params.pageNum);
      if (pageNum > 0) {
        const searchQuery = req.params.searchQuery;
        if (searchQuery !== undefined) {
          res.send(
            await moderatorService.getAllUsers(
              pageNum,
              searchQuery,
              roles.User,
              req.user.id
            )
          );
        } else {
          res.send(
            await moderatorService.getAllUsers(
              pageNum,
              undefined,
              roles.User,
              req.user.id
            )
          );
        }
      } else {
        res.sendStatus(400);
      }
    } catch {
      res.sendStatus(400);
    }
  }
);
router.get(
  "/getAllVets/:pageNum/:searchQuery?",
  authenticateModerator,
  async (req, res) => {
    try {
      const pageNum = parseInt(req.params.pageNum);
      if (pageNum > 0) {
        const searchQuery = req.params.searchQuery;
        if (searchQuery !== undefined) {
          res.send(
            await moderatorService.getAllUsers(pageNum, searchQuery, roles.Vet)
          );
        } else {
          res.send(
            await moderatorService.getAllUsers(pageNum, undefined, roles.Vet)
          );
        }
      } else {
        res.sendStatus(400);
      }
    } catch {
      res.sendStatus(400);
    }
  }
);
router.get("/getUserInfo/:id", authenticateModerator, async (req, res) => {
  if (req.params.id !== undefined && req.params.id !== "") {
    const user = await moderatorService.getUserInfo(req.params.id);
    if (user !== false) {
      if (user._id !== req.user.id) {
        res.send(user);
      } else {
        res.sendStatus(404);
      }
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(404);
  }
});
router.get(
  "/getVetsForModerationVerify/:pageNum",
  authenticateModerator,
  async (req, res) => {
    try {
      const pageNum = parseInt(req.params.pageNum);
      if (pageNum > 0) {
        res.send(await moderatorService.getVetsForModerationVerify(pageNum));
      } else {
        res.sendStatus(400);
      }
    } catch {
      res.sendStatus(400);
    }
  }
);
router.post("/moderationVerifyVet", authenticateModerator, async (req, res) => {
  validation(req.body, moderationVerifyVetSchema, res, async () => {
    res.send(await moderatorService.moderationVerifyVet(req.body.email));
  });
});
router.post("/deleteThread", authenticateModerator, async (req, res) => {
  validation(req.body, deleteThreadSchema, res, async () => {
    res.send(await moderatorService.deleteThread(req.body.threadId));
  });
});
router.post("/deleteThreadPost", authenticateModerator, async (req, res) => {
  validation(req.body, deleteThreadPostSchema, res, async () => {
    res.send(
      await moderatorService.deleteThreadPost(
        req.body.threadId,
        req.body.postId
      )
    );
  });
});
router.get("/getAllCampaigns/:pageNum/:searchQuery?", async (req, res) => {
  try {
    const pageNum = parseInt(req.params.pageNum);
    if (pageNum > 0) {
      res.send(
        await moderatorService.getAllCampaigns(req.params.searchQuery, pageNum)
      );
    } else {
      res.sendStatus(400);
    }
  } catch {
    res.sendStatus(400);
  }
});
router.get(
  "/getCampaignsForModerationVerify/:pageNum",
  authenticateModerator,
  async (req, res) => {
    try {
      const pageNum = parseInt(req.params.pageNum);
      if (pageNum > 0) {
        res.send(
          await moderatorService.getCampaignsForModerationVerify(pageNum)
        );
      } else {
        res.sendStatus(400);
      }
    } catch {
      res.sendStatus(400);
    }
  }
);
router.get("/getCampaign/:id", authenticateModerator, async (req, res) => {
  res.send(await moderatorService.getCampaign(req.params.id));
});
router.post(
  "/moderationVerifyFundrisingCampaign",
  authenticateModerator,
  async (req, res) => {
    validation(
      req.body,
      moderationVerifyCampaignSchema(req.body),
      res,
      async () => {
        res.send(
          await moderatorService.moderationVerifyFundrisingCampaign(
            req.body.campaignId,
            req.body.verified,
            req.body.rejectedComment
          )
        );
      }
    );
  }
);
router.post(
  "/completeFundrisingCampaign",
  authenticateModerator,
  async (req, res) => {
    validation(req.body, completeFundrisingCampaignSchema, res, async () => {
      res.send(
        await moderatorService.completeFundrisingCampaign(req.body.campaignId)
      );
    });
  }
);
router.get(
  "/document/:filename",
  authenticateGetModerator,
  async (req, res) => {
    const fileName = req.params.filename;
    let dir = `${path.dirname(require.main.filename)}/documents`;
    if (fs.existsSync(`${dir}/${fileName}`)) {
      res.sendFile(`${dir}/${fileName}`);
    } else {
      res.sendStatus(404);
    }
  }
);
module.exports = router;
