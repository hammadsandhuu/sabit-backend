const express = require("express");
const router = express.Router();
const controller = require("../controllers/shippingController");

router.post("/submit-shipping-form", controller.submitForm);
router.get("/submissions", controller.getSubmissions);
router.get("/submissions/by-date", controller.getBookingsByDate);


module.exports = router;
