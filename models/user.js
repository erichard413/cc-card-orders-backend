const db = require("../db");
const bcrypt = require("bcrypt");
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

class User {
  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT username,
            password,
            first_name AS "firstName",
            last_name AS "lastName",
            email,
            is_admin AS "isAdmin",
            is_cc_admin AS "isCcAdmin"
            FROM users WHERE username = $1`,
      [username]
    );
    const user = result.rows[0];

    if (user) {
      //validate hash password to user inputted password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }
    // if not, return error for invalid password/username
    throw new UnauthorizedError("Invalid username/password");
  }
  static async register({ username, password, firstName, lastName }) {
    // username must be an email address, else throw error.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username))
      throw new BadRequestError(`Username must be an email address!`);

    const duplicateCheck = await db.query(
      `SELECT username FROM users WHERE username=$1`,
      [username.toLowerCase()]
    );
    // if email address already exists as a user, throw error.
    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(
        `Username ${username.toLowerCase()} already exists!`
      );
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const result = await db.query(
      `INSERT INTO users (username, password, first_name, last_name, email, join_date, is_admin, is_cc_admin) VALUES ($1, $2, $3, $4, $1, CURRENT_TIMESTAMP, false, false) RETURNING username, first_name AS "firstName", last_name AS "lastName", email, join_date AS "joinDate", is_admin AS "isAdmin", is_cc_admin AS "isCcAdmin"`,
      [username.toLowerCase(), hashedPassword, firstName, lastName]
    );
    const user = result.rows[0];
    return user;
  }
}

module.exports = User;
