const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "Iconscribe",
});

db.connect((err) => {
  if (err) {
    console.error(" Database connection failed:", err.message);
    process.exit(1);
  }
  console.log("✅ Connected to MySQL Database!");
});

app.get("/users", (req, res) => {
  const query = "SELECT * FROM users";
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching users:", err.message);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.json(results);
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
