const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const productRoutes = require("./routes/products");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", maintenanceRoutes);
app.use("/api/products", productRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
