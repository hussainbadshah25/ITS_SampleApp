const express = require("express");
const router = express.Router();
const masterController = require("../Controllers/masterController");
const { authenticateToken } = require("../Middlewares/auth");

// Country routes
router.get("/countries", authenticateToken, masterController.getCountries);

// City routes
router.get(
  "/cities/by-country/:countryId",
  authenticateToken,
  masterController.getCities
);
router.get(
  "/countriesCities",
  authenticateToken,
  masterController.getCountriesCities
);

// Hobbies routes
router.get("/hobbies", authenticateToken, masterController.gethobbies);

module.exports = router;
