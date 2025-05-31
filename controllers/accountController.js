require("dotenv").config();
const utilities = require("../utilities");
const bcrypt = require("bcryptjs");
const accountModel = require("../models/account-model");

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  // req.flash("notice", "This is a flash message.!!!@2");
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration with hashed password
 * *************************************** */
async function registerAccount(req, res) {
  try {
    let nav = await utilities.getNav();
    const {
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(account_password, 10);

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword // Use the hashed password
    );

    if (regResult && regResult.rowCount > 0) {
      req.flash(
        "notice",
        `Congratulations, you are registered ${account_firstname}. Please log in.`
      );
      res.status(201).render("account/login", {
        title: "Login",
        nav,
      });
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    req.flash("notice", "There was a server error. Please try again.");
    res.status(500).render("account/register", {
      title: "Registration",
      nav: await utilities.getNav(),
      errors: null,
    });
  }
}

module.exports = { buildLogin, buildRegister, registerAccount };
