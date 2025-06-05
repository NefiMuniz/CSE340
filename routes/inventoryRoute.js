// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");

// Build by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventoryId", invController.buildByInventoryId);

// Classification management
router.get("/", utilities.handleErrors(invController.buildManagementView));
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
);
router.post(
  "/add-classification",
  utilities.handleErrors(invController.addClassification)
);

// Inventory management
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
);
router.post(
  "/add-inventory",
  utilities.handleErrors(invController.addInventory)
);
// Inventory Edit route
router.get(
  "/edit/:inventoryId",
  utilities.handleErrors(invController.buildEditInventory)
);
router.post(
  "/update/",
  utilities.handleErrors(invController.updateInventory)
);

// AJAX inventory api call route
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

module.exports = router;
