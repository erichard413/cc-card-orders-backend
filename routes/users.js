// routes for users

const jsonschema = require("jsonschema");
const userNew = require("../schema/userNew.json");
const express = require("express");
const {
  ensureCorrectUserOrAdmin,
  ensureAdmin,
  ensureSuperAdmin,
} = require("../middleware/auth");
const { paginatedResults } = require("../helpers/paginatedResults");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const router = new express.Router();

// GET /all
// Gets list of all users, admin required
// query params can include username
router.get("/all", ensureAdmin, async function (req, res, next) {
  const username = req.query.username || null;
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const result = await User.getAll(username);
    return res.json(paginatedResults(result, page, limit));
  } catch (err) {
    return next(err);
  }
});

// GET

// GET /:username
// Gets basic user information
// Will output full data for admin or correct user
router.get("/:username", async function (req, res, next) {
  const user = res.locals.user;
  try {
    const result =
      user && (user.isAdmin || user.username == req.params.username)
        ? await User.adminGetUser(req.params.username)
        : await User.getUser(req.params.username);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
