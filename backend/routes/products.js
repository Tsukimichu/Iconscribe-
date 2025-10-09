const express = require("express");
const db = require("../models/db.js");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage });


// GET all products
router.get("/", (req, res) => {
  db.query("SELECT * FROM products", (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch products" });
    res.json(rows);
  });
});


// ADD new product (no image yet)
router.post("/", (req, res) => {
  const { product_name, product_type, status } = req.body;
  db.query(
    "INSERT INTO products (product_name, status) VALUES (?, ?)",
    [product_name, status || "Active"],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Failed to add product" });
      res.json({
        product_id: result.insertId,
        product_name,
        status,
      });
    }
  );
});


// Upload SINGLE image (Binding, Books, RaffleTicket)
router.post("/upload/single/:id", upload.single("image1"), (req, res) => {
  const imagePath = `/uploads/${req.file.filename}`;
  const { id } = req.params;

  db.query(
    "UPDATE products SET image1 = ? WHERE product_id = ?",
    [imagePath, id],
    (err) => {
      if (err) return res.status(500).json({ error: "Failed to upload image" });
      res.json({ success: true, imagePath });
    }
  );
});


// Upload DOUBLE images (Brochure, Flyers, etc.)
router.post(
  "/upload/double/:id",
  upload.fields([{ name: "image1" }, { name: "image2" }]),
  (req, res) => {
    const image1Path = req.files["image1"]
      ? `/uploads/${req.files["image1"][0].filename}`
      : null;
    const image2Path = req.files["image2"]
      ? `/uploads/${req.files["image2"][0].filename}`
      : null;
    const { id } = req.params;

    db.query(
      "UPDATE products SET image1 = ?, image2 = ? WHERE product_id = ?",
      [image1Path, image2Path, id],
      (err) => {
        if (err)
          return res.status(500).json({ error: "Failed to upload images" });
        res.json({ success: true, image1Path, image2Path });
      }
    );
  }
);

//  Update product status
router.put("/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.query(
    "UPDATE products SET status = ? WHERE product_id = ?",
    [status, id],
    (err) => {
      if (err) return res.status(500).json({ error: "Failed to update status" });
      res.json({ success: true });
    }
  );
});

module.exports = router;
