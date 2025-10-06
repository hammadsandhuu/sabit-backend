// routes/shipping.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/shippingController");

router.post("/submit", controller.submitForm);
router.get("/auth-status", controller.getAuthStatus);
router.get("/submissions", controller.getSubmissions);
router.get("/submissions/by-date", controller.getBookingsByDate);

module.exports = router;
