"use strict";
const express = require("express");
let router = express.Router();
const ThreadService = require("../services/thread");
const threadService = new ThreadService();
const validation = require("../models/validation/validation");
const createThreadSchema = require("../models/validation/thread/createThread");
const createThreadPostSchema = require("../models/validation/thread/createThreadPost");
const replyToPostSchema = require("../models/validation/thread/replyToPost");
const authenticate = require("../authentication/authenticate");
router.post("/createThread", authenticate, async (req, res) => {
  validation(req.body, createThreadSchema, res, async () => {
    res.send(
      await threadService.createThread(
        req.body.topic,
        req.body.description,
        req.user.id
      )
    );
  });
});
router.post("/createThreadPost", authenticate, async (req, res) => {
  validation(req.body, createThreadPostSchema, res, async () => {
    res.send(
      await threadService.createThreadPost(
        req.body.threadId,
        req.user.id,
        req.body.content
      )
    );
  });
});
router.post("/replyToPost", authenticate, async (req, res) => {
  validation(req.body, replyToPostSchema, res, async () => {
    res.send(
      await threadService.replyToPost(
        req.body.threadId,
        req.body.postId,
        req.user.id,
        req.body.reply
      )
    );
  });
});
router.get("/posts/:id/:page", async (req, res) => {
  try {
    const page = parseInt(req.params.page);
    if (page > 0) {
      res.send(await threadService.getThreadPosts(req.params.id, page));
    } else {
      res.sendStatus(400);
    }
  } catch {
    res.sendStatus(400);
  }
});
router.get("/:id", async (req, res) => {
  res.send(await threadService.getThread(req.params.id));
});
module.exports = router;
