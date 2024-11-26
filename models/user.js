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
            is_cc_admin AS "isCcAdmin",
            bank
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
  // register user route
  static async register({ username, password, firstName, lastName, bank }) {
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
      `INSERT INTO users (username, password, first_name, last_name, email, join_date, is_admin, is_cc_admin, bank) VALUES ($1, $2, $3, $4, $1, CURRENT_TIMESTAMP, false, false, $5) RETURNING username, first_name AS "firstName", last_name AS "lastName", email, join_date AS "joinDate", is_admin AS "isAdmin", is_cc_admin AS "isCcAdmin", bank`,
      [username.toLowerCase(), hashedPassword, firstName, lastName, bank]
    );
    const user = result.rows[0];
    return user;
  }
  // function to get all users
  static async getAll(nameLike) {
    let params = [];
    let queryString = `SELECT username, first_name AS "firstName", last_name AS "lastName", join_date AS "joinDate", email, is_admin AS "isAdmin", is_cc_admin AS "isCcAdmin" FROM users`;
    if (nameLike) queryString += ` WHERE username ILIKE $1`;
    if (nameLike) params.push(`%${nameLike}%`);
    queryString += ` ORDER BY username ASC`;
    const result = await db.query(queryString, params);
    return result.rows;
  }
  //This is to get another user's data - limited information
  static async getUser(username) {
    const result = await db.query(
      `SELECT username, first_name AS "firstName", last_name AS "lastName", join_date AS "joinDate", bank FROM users WHERE username=$1`,
      [username]
    );
    if (!result.rows[0])
      throw new NotFoundError(`Username ${username} not found!`);
    return result.rows[0];
  }
  //This is to retrieve user data as an ADMIN -> admins get access to full account information
  static async adminGetUser(username) {
    const result = await db.query(
      `SELECT username, first_name AS "firstName", last_name AS "lastName", join_date AS "joinDate", email, is_admin AS "isAdmin", is_cc_admin AS "isCcAdmin", bank FROM users WHERE username=$1`,
      [username]
    );
    if (!result.rows[0])
      throw new NotFoundError(`Username ${username} not found!`);
    return result.rows[0];
  }
  // update user
  static async updateUser(username, data) {
    // delete data.is_admin to prevent SQL attacks. Users shouldn't be able to use this to make themselves admin.
    // ----------- put delete admin  here
    //encrypt the password, if data contains it
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }
    if (data.email) {
      const emailCheck = await db.query(
        `SELECT username FROM users WHERE email=$1`,
        [data.email.toLowerCase()]
      );
      if (emailCheck.rows[0])
        throw new BadRequestError(
          `Email ${data.email.toLowerCase()} is already associated with an account!`
        );
    }
    const { setCols, values } = sqlForPartialUpdate(data, {
      firstName: "first_name",
      lastName: "last_name",
      email: "email",
      bank: "bank",
    });
    const usernameVarIdx = "$" + (values.length + 1);
    const querySQL = `UPDATE users SET ${setCols} WHERE username=${usernameVarIdx} RETURNING username, first_name AS "firstName", last_name AS "lastName", email, join_date AS "joinDate", is_admin AS "isAdmin", is_cc_admin AS "isCcAdmin", bank`;
    const result = await db.query(querySQL, [...values, username]);
    const user = result.rows[0];
    if (!user) throw new NotFoundError(`No user: ${username}`);
    delete user.password;
    return user;
  }
}

module.exports = User;
