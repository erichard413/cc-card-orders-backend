const db = require("../db");
// const { sqlForPartialUpdate } = require("../helpers/sql");
// const axios = require("axios");
// const crypto = require("crypto");

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class Bank {
  static async addNewBank({ name, phone, website, city, state, address }) {
    await db.query(
      `INSERT INTO banks (name, phone, website, city, state, address) VALUES ($1, $2, $3, $4, $5, $6)`,
      [name, phone, website, city, state, address]
    );
    return;
  }
}

module.exports = Bank;
