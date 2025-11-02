const express = require("express");
const router = express.Router();
const mysqldump = require("mysqldump");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const db = require("../models/db");

// Ensure backup folder exists
const backupFolder = path.join(__dirname, "../backups");
if (!fs.existsSync(backupFolder)) fs.mkdirSync(backupFolder);

// File upload setup for restores
const upload = multer({ dest: backupFolder });

/* =====================================================
 CREATE DATABASE BACKUP
===================================================== */
router.post("/create", async (req, res) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `backup-${timestamp}.sql`;
    const filepath = path.join(backupFolder, filename);

    await mysqldump({
      connection: {
        host: "localhost",
        user: "root",
        password: "",
        database: "iconscribe",
      },
      dumpToFile: filepath,
    });

    // Get backup file size
    const stats = fs.statSync(filepath);
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2) + " MB";

    // Save log entry
    db.query(
      "INSERT INTO backup_history (filename, scope, size, status) VALUES (?, ?, ?, ?)",
      [filename, req.body.scope || "All", sizeMB, "Success"]
    );

    res.json({ success: true, message: "Backup created successfully", filename });
  } catch (err) {
    console.error("Backup failed:", err);
    res.status(500).json({ success: false, message: "Backup failed" });
  }
});

/* =====================================================
 LIST ALL BACKUPS FROM DATABASE
===================================================== */
router.get("/list-db", (req, res) => {
  db.query("SELECT * FROM backup_history ORDER BY created_at DESC", (err, rows) => {
    if (err) {
      console.error("Error fetching backups:", err);
      return res.status(500).json({ error: "Failed to fetch backups" });
    }
    res.json(rows);
  });
});

/* =====================================================
 DOWNLOAD A BACKUP FILE
===================================================== */
router.get("/download/:filename", (req, res) => {
  const filePath = path.join(backupFolder, req.params.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ success: false, message: "File not found" });
  }
});

/* =====================================================
 DELETE A BACKUP
===================================================== */
router.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT filename FROM backup_history WHERE id = ?", [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ success: false, message: "Backup not found" });
    }

    const filename = results[0].filename;
    const filePath = path.join(backupFolder, filename);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    db.query("DELETE FROM backup_history WHERE id = ?", [id]);

    res.json({ success: true, message: "Backup deleted successfully" });
  });
});

/* =====================================================
 RESTORE DATABASE (USING UPLOADED FILE)
===================================================== */
router.post("/restore", upload.single("file"), (req, res) => {
  const filePath = req.file.path;
  const filename = req.file.originalname;

  const command = `mysql -u root iconscribe < "${filePath}"`;

  exec(command, (err) => {
    fs.unlinkSync(filePath); // delete uploaded file

    if (err) {
      console.error("Restore failed:", err);
      db.query(
        "INSERT INTO restore_history (filename, performed_by, status) VALUES (?, ?, ?)",
        [filename, "Admin", "Failed"]
      );
      return res.status(500).json({ success: false, message: "Restore failed" });
    }

    db.query(
      "INSERT INTO restore_history (filename, performed_by, status) VALUES (?, ?, ?)",
      [filename, "Admin", "Success"]
    );

    res.json({ success: true, message: "Database restored successfully" });
  });
});

/* =====================================================
 LIST RESTORE HISTORY
===================================================== */
router.get("/restore/list-db", (req, res) => {
  db.query("SELECT * FROM restore_history ORDER BY restored_at DESC", (err, rows) => {
    if (err) {
      console.error("Error fetching restore history:", err);
      return res.status(500).json([]);
    }
    res.json(rows);
  });
});

module.exports = router;
