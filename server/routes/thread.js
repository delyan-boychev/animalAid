"use strict";
const express = require("express");
let router = express.Router();
const ThreadService = require("../services/thread");
const threadService = new ThreadService();
const validation = require("../models/validation/validation");
const createThreadSchema = require("../models/validation/thread/createThread");
const createThreadPostSchema = require("../models/validation/thread/createThreadPost");
const editThreadSchema = require("../models/validation/thread/editThread");
const editThreadPostSchema = require("../models/validation/thread/editThreadPost");
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
        req.body.content,
        req.body.replyTo
      )
    );
  });
});
router.post("/editThread", authenticate, async (req, res) => {
  validation(req.body, editThreadSchema, res, async () => {
    res.send(
      await threadService.editThread(
        req.body.threadId,
        req.user.id,
        req.body.topic,
        req.body.description
      )
    );
  });
});
router.post("/editThreadPost", authenticate, async (req, res) => {
  validation(req.body, editThreadPostSchema, res, async () => {
    res.send(
      await threadService.editThreadPost(
        req.body.threadId,
        req.body.postId,
        req.user.id,
        req.body.content,
        req.body.replyTo
      )
    );
  });
});
router.get("/getAllThreads/:pageNum/:searchQuery?", async (req, res) => {
  try {
    const pageNum = parseInt(req.params.pageNum);
    if (pageNum > 0) {
      res.send(
        await threadService.getAllThreads(req.params.searchQuery, pageNum)
      );
    } else {
      res.sendStatus(400);
    }
  } catch {
    res.sendStatus(400);
  }
});
router.get("/getThreadForEdit/:id", authenticate, async (req, res) => {
  res.send(await threadService.getThreadForEdit(req.params.id, req.user.id));
});
router.get("/posts/:id/:page", async (req, res) => {
  const page = parseInt(req.params.page);
  if (page > 0) {
    res.send(await threadService.getThreadPosts(req.params.id, page));
  } else {
    res.sendStatus(400);
  }
});
router.get("/:id", async (req, res) => {
  res.send(await threadService.getThread(req.params.id));
});
module.exports = router;
