// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
// const regValidate = require("../utilities/account-validation");

// router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagementView));
router.get("/login", utilities.handleErrors(accountController.buildLogin));
// router.post("/login", reg)

module.exports = router;
