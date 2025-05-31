const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  // console.log(data);
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach(function (vehicle) {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">';
      grid +=
        '<img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" />';
      grid += '<div class="namePrice">';
      grid += "<h2>" + vehicle.inv_make + " " + vehicle.inv_model + "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</a>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/**
 * Build a single detail element from data
 */
Util.buildVehicleDetail = async function (data) {
  let detailHTML = "";
  console.dir({ data });
  if (data) {
    detailHTML = `
      <section class="vehicle-detail">
        <div class="vehicle-detail-image">
          <img src="${data.inv_image}" alt="Image of ${data.inv_make} ${
      data.inv_model
    }">
        </div>
        <div class="vehicle-detail-info">
          <h2>${data.inv_year} ${data.inv_make} ${data.inv_model}</h2>
          <h3>Price: ${Number.parseFloat(data.inv_price).toLocaleString(
            "en-US",
            {
              style: "currency",
              currency: "USD",
            }
          )}</h3>
          <p><strong>Mileage:</strong> ${Number(
            data.inv_miles
          ).toLocaleString()} miles</p>
          <p><strong>Color:</strong> ${data.inv_color}</p>
          <p><strong>Description:</strong> ${data.inv_description}</p>
        </div>
      </section>`;
  } else {
    detailHTML = `<p>Sorry, vehicle details could not be found.</p>`;
  }
  return detailHTML;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Function to update the browser cookie.
 * @param {object} accountData
 * @param {import("express").Response} res
 */

Util.updateCookie = (accountData, res) => {
  const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 3600,
  });
  if (process.env.NODE_ENV === "development") {
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
  } else {
    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 3600 * 1000,
    });
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

module.exports = Util;
