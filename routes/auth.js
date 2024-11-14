const express = require("express");
const router = new express.Router();
const { BadRequestError } = require();
// const userAuthSchema = require("../schema/userAuth.json");

// POST /auth/token: {username, password} will return token.

router.post("/auth/token", async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, userAuthSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
