const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const shippingRoutes = require("./routes/shippingRoutes");
const authRoutes = require("./routes/authRoutes");

app.use(cors());
app.use(express.json());

app.use("/api", shippingRoutes);
app.use("/auth", authRoutes);

app.get("/", (_, res) => {
  res.json({ success: true, message: "Server is running" });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
