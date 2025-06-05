const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = utilities.handleErrors(async function (
  req,
  res,
  next
) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
});

/* ***************************
 *  Build vehicle detail display
 * ************************** */
invCont.buildByInventoryId = utilities.handleErrors(async function (
  req,
  res,
  next
) {
  const inventoryId = req.params.inventoryId;
  const data = await invModel.getInventoryByInventoryId(inventoryId);

  if (!data || data.length === 0) return next(new Error("Vehicle not found"));

  const details = await utilities.buildVehicleDetail(data[0]);
  let nav = await utilities.getNav();
  const title = `${data[0].inv_make} ${data[0].inv_model}`;

  res.render("./inventory/detail", {
    title,
    nav,
    details,
  });
});

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render("inventory/management", {
    title: "Vehicle Management",
    errors: null,
    nav,
    classificationSelect,
  });
};

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();

  res.render("inventory/addClassification", {
    title: "Add New Classification",
    nav,
    errors: null,
  });
};

/* ***************************
 *  Add classification request
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body;
  const nav = await utilities.getNav();

  const namePattern = /^[0-9a-zA-Z]+$/;
  const errors = [];

  // Validate input
  if (!classification_name || !namePattern.test(classification_name)) {
    errors.push(
      "Classification name must only contain letters and numbers — no spaces or special characters."
    );
  }

  if (errors.length > 0) {
    // req.flash("notice", errors.join(" "));
    return res.render("inventory/addClassification", {
      title: "Add New Classification",
      errors,
      nav,
      locals: {
        classification_name,
      },
    });
  }

  const response = await invModel.addClassification(classification_name);
  if (response) {
    req.flash(
      "notice",
      `The "${classification_name}" classification was successfully added.`
    );
    res.render("inventory/management", {
      title: "Vehicle Management",
      errors: null,
      nav,
      classification_name,
    });
  } else {
    req.flash("notice", `Failed to add ${classification_name}`);
    res.render("inventory/addClassification", {
      title: "Add New Classification",
      errors: null,
      nav,
      locals: {
        classification_name,
      },
    });
  }
};

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  const nav = await utilities.getNav();
  let classifications = await utilities.buildClassificationList();

  res.render("inventory/addInventory", {
    title: "Add Vehicle",
    errors: null,
    nav,
    classifications,
  });
};

/* ***************************
 *  Add inventory request
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  const nav = await utilities.getNav();

  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const response = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  if (response) {
    req.flash(
      "notice",
      `The ${inv_year} ${inv_make} ${inv_model} successfully added.`
    );
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const classifications = await utilities.buildClassificationList();
    res.render("inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationSelect,
      classifications,
      errors: null,
    });
  } else {
    req.flash("notice", "There was a problem.");
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const classifications = await utilities.buildClassificationList();

    // Server-side validation for each form field
    const errors = [];
    if (!inv_make || inv_make.length < 2 || inv_make.length > 50) {
      errors.push("Make must be between 2 and 50 characters.");
    }
    if (!inv_model || inv_model.length < 2 || inv_model.length > 50) {
      errors.push("Model must be between 2 and 50 characters.");
    }
    if (!inv_year || inv_year < 1900 || inv_year > 2030) {
      errors.push("Year must be between 1900 and 2030.");
    }
    if (
      !inv_description ||
      inv_description.length < 2 ||
      inv_description.length > 100
    ) {
      errors.push("Description must be between 2 and 100 characters.");
    }
    if (!inv_image) {
      errors.push("Image path is required.");
    }
    if (!inv_thumbnail) {
      errors.push("Thumbnail path is required.");
    }
    if (inv_price === "" || inv_price === 0 || inv_price === undefined || isNaN(inv_price)) {
      errors.push("Price must be a valid number.");
    }
    if (inv_miles === "" || inv_miles === 0 || inv_miles === undefined || isNaN(inv_miles)) {
      errors.push("Miles must be a valid number.");
    }
    if (!inv_color) {
      errors.push("Color is required.");
    }
    if (!classification_id) {
      errors.push("Classification is required.");
    }

    if (errors.length > 0) {
      req.flash("notice", "Please correct the following errors:");
      return res.render("inventory/addInventory", {
        title: "Add Vehicle",
        nav,
        classificationSelect,
        classifications,
        errors,
        locals: {
          inv_make,
          inv_model,
          inv_year,
          inv_description,
          inv_image,
          inv_thumbnail,
          inv_price,
          inv_miles,
          inv_color,
          classification_id,
        },
      });
    }

    // General errors
    req.flash("notice", "There was a problem.");
    res.render("inventory/addInventory", {
      title: "Add Vehicle",
      nav,
      classificationSelect,
      classifications,
      errors: null,
      locals: {
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
      },
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build Edit Inventory View
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  const inventory_id = parseInt(req.params.inventoryId);
  const nav = await utilities.getNav();

  const inventoryData = (
    await invModel.getInventoryByInventoryId(inventory_id)
  )[0];
  const name = `${inventoryData.inv_make} ${inventoryData.inv_model}`;

  let classifications = await utilities.buildClassificationList(
    inventoryData.classification_id
  );

  res.render("inventory/editInventory", {
    title: "Edit " + name,
    errors: null,
    nav,
    classifications,
    inv_id: inventoryData.inv_id,
    inv_make: inventoryData.inv_make,
    inv_model: inventoryData.inv_model,
    inv_year: inventoryData.inv_year,
    inv_description: inventoryData.inv_description,
    inv_image: inventoryData.inv_image,
    inv_thumbnail: inventoryData.inv_thumbnail,
    inv_price: inventoryData.inv_price,
    inv_miles: inventoryData.inv_miles,
    inv_color: inventoryData.inv_color,
    classification_id: inventoryData.classification_id,
  });
};


/* ***************************
 *  Update Inventory
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  const nav = await utilities.getNav();

  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const response = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  if (response) {
    const itemName = response.inv_make + " " + response.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classifications = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("inventory/editInventory", {
      title: "Edit " + itemName,
      nav,
      errors: null,
      classifications,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

/* ***************************
 *  Build Delete Inventory
 * ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
  const inventory_id = parseInt(req.params.inventoryId);
  const nav = await utilities.getNav();

  const inventoryData = (
    await invModel.getInventoryByInventoryId(inventory_id)
  )[0];
  const name = `${inventoryData.inv_make} ${inventoryData.inv_model}`;

  res.render("inventory/deleteInventory", {
    title: "Delete " + name,
    errors: null,
    nav,
    inv_id: inventoryData.inv_id,
    inv_make: inventoryData.inv_make,
    inv_model: inventoryData.inv_model,
    inv_year: inventoryData.inv_year,
    inv_price: inventoryData.inv_price,
    inv_color: inventoryData.inv_color,
  });
};

/* ***************************
 *  Delete Inventory Request
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  const nav = await utilities.getNav();
  const inventory_id = parseInt(req.body.inv_id);
  const { inv_id, inv_make, inv_model, inv_year, inv_price } = req.body;

  const queryResponse = await invModel.deleteInventory(inventory_id);
  const itemName = `${inv_make} ${inv_model}`;

  if (queryResponse) {
    req.flash("notice", `The ${itemName} was successfully deleted.`);
    res.redirect("/inv/");
  } else {

    req.flash("notice", "Sorry, the deletion failed.");
    res.status(501).render("inventory/deleteInventory", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      inv_color,
    });
  }
};


module.exports = invCont;
