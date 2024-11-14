const express = require("express");
const router = new express.Router();

// GET /

router.get("/", (req, res) => {
  const message = "Hello from Express!";
  return res.json({ message });
});

module.exports = router;
