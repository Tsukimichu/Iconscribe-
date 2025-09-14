const express = require("express");
const router = express.Router();
const db = require("../models/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // <-- use bcrypt (or bcryptjs if native build fails)

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 12;

// =================== SIGNUP ===================
router.post("/signup", async (req, res) => {
  const { name, phone, email, address, password, role } = req.body;

  if (!name || !phone || !email || !address || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const query =
      "INSERT INTO users (name, phone, email, address, password, role) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(
      query,
      [name, phone, email, address, hashedPassword, role || "user"],
      (err, result) => {
        if (err) {
          console.error("❌ Error inserting user:", err.message);
          return res
            .status(500)
            .json({ success: false, message: "Database insert failed" });
        }

        res.json({
          success: true,
          message: "✅ User registered successfully!",
          data: {
            id: result.insertId,
            name,
            phone,
            email,
            address,
            role: role || "user",
          },
        });
      }
    );
  } catch (err) {
    console.error("❌ Error hashing password:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// =================== LOGIN ===================
router.post("/login", (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Name and password are required" });
  }

  const query = "SELECT * FROM users WHERE name = ?";
  db.query(query, [name], async (err, results) => {
    if (err) {
      console.error("❌ DB error on login:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (results.length === 0) {
      console.log("❌ No user found with name:", name);
      return res
        .status(401)
        .json({ success: false, message: "Invalid name or password" });
    }

    const user = results[0];
    console.log("✅ Found user in DB:", user);

    try {
      const match = await bcrypt.compare(password, user.password);
      console.log("🔑 Password match?", match);

      if (!match) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid name or password" });
      }

      let token;
      try {
        token = jwt.sign(
          { id: user.user_id, role: user.role },
          SECRET_KEY,
          { expiresIn: "1h" }
        );
      } catch (jwtErr) {
        console.error("❌ JWT signing error:", jwtErr);
        return res.status(500).json({ success: false, message: "Token generation failed" });
      }

      return res.json({
        success: true,
        message: "✅ Login successful",
        token, // token at top-level
        user: {
          id: user.user_id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    } catch (err) {
      console.error("❌ Error comparing password:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  });
});



// =================== UPDATE USER STATUS ===================
router.put("/users/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const query = "UPDATE users SET status = ? WHERE user_id = ?";
  db.query(query, [status, id], (err) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Database update failed" });
    }
    res.json({
      success: true,
      message: `✅ User status updated to ${status}`,
      data: { id, status },
    });
  });
});

// =================== ARCHIVE / RESTORE ===================
router.put("/users/:id/archive", (req, res) => {
  const { id } = req.params;
  const query = "UPDATE users SET archived = 1 WHERE user_id = ?";
  db.query(query, [id], (err) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Database update failed" });
    }
    res.json({ success: true, message: "✅ User archived", data: { id } });
  });
});

router.put("/users/:id/restore", (req, res) => {
  const { id } = req.params;
  const query = "UPDATE users SET archived = 0 WHERE user_id = ?";
  db.query(query, [id], (err) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Database update failed" });
    }
    res.json({ success: true, message: "✅ User restored", data: { id } });
  });
});

// =================== GET USERS (SAFE FIELDS ONLY) ===================
router.get("/users", (req, res) => {
  const query =
    "SELECT user_id, name, email, phone, role, status, archived FROM users WHERE archived = 0";
  db.query(query, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Database query failed" });
    }
    res.json({
      success: true,
      message: "✅ Active users fetched",
      data: results,
    });
  });
});

router.get("/users/archived", (req, res) => {
  const query =
    "SELECT user_id, name, email, phone, role, status, archived FROM users WHERE archived = 1";
  db.query(query, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Database query failed" });
    }
    res.json({
      success: true,
      message: "✅ Archived users fetched",
      data: results,
    });
  });
});

module.exports = router;
