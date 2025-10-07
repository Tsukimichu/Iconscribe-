const express = require("express");
const router = express.Router();
const db = require("../models/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 12;

/* =================== SIGNUP =================== */
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
          console.error("Error inserting user:", err.message);
          return res
            .status(500)
            .json({ success: false, message: "Database insert failed" });
        }

        res.json({
          success: true,
          message: "User registered successfully!",
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
    console.error("Error hashing password:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* =================== LOGIN =================== */
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
      console.error("DB error on login:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (results.length === 0) {
      console.log("No user found with name:", name);
      return res
        .status(401)
        .json({ success: false, message: "Invalid name or password" });
    }

    const user = results[0];
    console.log("Found user in DB:", user);

    try {
      const match = await bcrypt.compare(password, user.password);
      console.log("Password match?", match);

      if (!match) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid name or password" });
      }

      // ✅ Ensure token payload uses `id` consistently
      const payload = { id: user.user_id, role: user.role };
      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
      console.log("Signed JWT payload:", payload);

      return res.json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user.user_id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          business: user.business || "",
          role: user.role,
        },
      });
    } catch (err) {
      console.error("Error comparing password:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  });
});

/* =================== GET LOGGED-IN USER PROFILE =================== */
router.get("/profile", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      console.log("❌ No authorization header");
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      console.log("❌ Empty token");
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
      console.log("✅ Token decoded:", decoded);
    } catch (err) {
      console.log("❌ Token verification failed:", err.message);
      return res.status(403).json({ success: false, message: "Invalid or expired token" });
    }

    const userId = decoded.id;
    if (!userId) {
      console.log("❌ Decoded token missing `id`");
      return res.status(403).json({ success: false, message: "Invalid token payload" });
    }

    const query = `
      SELECT user_id, name, email, phone, address, business
      FROM users
      WHERE user_id = ?
    `;

    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error("❌ Database error:", err);
        return res.status(500).json({ success: false, message: "Database query failed" });
      }

      if (results.length === 0) {
        console.log("⚠️ No user found for ID:", userId);
        return res.status(404).json({ success: false, message: "User not found" });
      }

      console.log("✅ User profile fetched successfully:", results[0]);
      return res.json({ success: true, data: results[0] });
    });
  } catch (error) {
    console.error("❌ Server error in /profile:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});



/* =================== UPDATE USER STATUS =================== */
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
      message: `User status updated to ${status}`,
      data: { id, status },
    });
  });
});

/* =================== UPDATE USER INFO (Profile Edit) =================== */
router.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address, business } = req.body;

  if (!name || !email || !phone || !address) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const query = `
    UPDATE users 
    SET name = ?, email = ?, phone = ?, address = ?, business = ?
    WHERE user_id = ?
  `;

  db.query(query, [name, email, phone, address, business || null, id], (err) => {
    if (err) {
      console.error("Error updating user:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database update failed" });
    }

    res.json({ success: true, message: "User profile updated successfully" });
  });
});

/* =================== ARCHIVE / RESTORE =================== */
router.put("/users/:id/archive", (req, res) => {
  const { id } = req.params;
  const query = `UPDATE users SET is_archived = 1 WHERE user_id = ?`;

  db.query(query, [id], (err) => {
    if (err) {
      console.error("❌ Error archiving user:", err);
      return res.status(500).json({ success: false, message: "Database update failed" });
    }
    res.json({ success: true, message: "User archived successfully" });
  });
});


router.put("/users/:id/restore", (req, res) => {
  const { id } = req.params;
  const query = "UPDATE users SET is_archived = 0 WHERE user_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("❌ Restore user error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database update failed" });
    }

    console.log("✅ Restore result:", result);
    res.json({ success: true, message: "User restored", data: { id } });
  });
});


/* =================== GET USERS (Active) =================== */
router.get("/users", (req, res) => {
  const query = `
    SELECT user_id, name, email, phone, role, status, address, business, is_archived
    FROM users
    WHERE role NOT IN ('admin', 'manager') AND is_archived = 0
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching users:", err);
      return res.status(500).json({ success: false, message: "Database query failed" });
    }
    res.json({ success: true, message: "Active users fetched", data: results });
  });
});


/* =================== GET USERS (Archived) =================== */
router.get("/users/archived", (req, res) => {
  const query = `
    SELECT user_id, name, email, phone, role, status, address, business, is_archived
    FROM users
    WHERE is_archived = 1
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching archived users:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
    res.json({ success: true, message: "Archived users fetched", data: results });
  });
});


module.exports = router;
