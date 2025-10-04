const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "iconscribe",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

console.log("Database connected successfully.");

module.exports = db;
