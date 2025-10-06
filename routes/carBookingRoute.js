const express = require("express");
const router = express.Router();
const { CarBooking } = require("../controllers/carBookingController");

router.post("/submit-car-booking", CarBooking);

module.exports = router;
