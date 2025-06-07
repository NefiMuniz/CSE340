// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");

// Build by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventoryId", invController.buildByInventoryId);

// Management View
router.get(
  "/",
  utilities.checkAuthorizationManager,
  utilities.handleErrors(invController.buildManagementView)
);

// Classification management
router.get(
  "/add-classification",
  utilities.checkAuthorizationManager,
  utilities.handleErrors(invController.buildAddClassification)
);
router.post(
  "/add-classification",
  utilities.checkAuthorizationManager,
  utilities.handleErrors(invController.addClassification)
);

// Inventory management
router.get(
  "/add-inventory",
  utilities.checkAuthorizationManager,
  utilities.handleErrors(invController.buildAddInventory)
);
router.post(
  "/add-inventory",
  utilities.checkAuthorizationManager,
  utilities.handleErrors(invController.addInventory)
);
// Inventory Edit route
router.get(
  "/edit/:inventoryId",
  utilities.checkAuthorizationManager,
  utilities.handleErrors(invController.buildEditInventory)
);
router.post(
  "/update/",
  utilities.checkAuthorizationManager,
  utilities.handleErrors(invController.updateInventory)
);

// Inventory Delete Route
router.get(
  "/delete/:inventoryId",
  utilities.checkAuthorizationManager,
  utilities.handleErrors(invController.buildDeleteInventory)
);
router.post(
  "/delete/",
  utilities.checkAuthorizationManager,
  utilities.handleErrors(invController.deleteInventory)
);

// AJAX inventory api call route
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

module.exports = router;
