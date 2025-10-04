const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const productStatus = require("./routes/productStatus");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", maintenanceRoutes);
app.use("/api/product_status", productStatus);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
