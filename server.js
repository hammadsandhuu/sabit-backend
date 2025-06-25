require("dotenv").config();
const express = require("express");
const cors = require("cors");
const shippingRoutes = require("./routes/shippingRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", shippingRoutes);

// Health
app.get("", (_, res) =>
  res.json({ success: true, message: "Server is running" })
);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
