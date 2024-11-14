"use strict";

const express = require("express");
const { NotFoundError } = require("./expressError");
const cors = require("cors");
const morgan = require("morgan");
const commonRoutes = require("./routes/common");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

//routes go here
app.use("/", commonRoutes);

//handle 404 errors
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

// generic error - anything unhandled goes here
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
