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
if (!fs.existsSync(backupFolder)) fs.mkdirSync(backupFolder, { recursive: true });

// File upload setup
const upload = multer({ dest: backupFolder });

/* =====================================================
 CREATE DATABASE BACKUP (using native mysqldump)
===================================================== */
router.post("/create", async (req, res) => {
  try {
    // Get current date in YYYY-MM-DD
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const filename = `backup-iconscribe-${dateStr}.sql`;
    const filepath = path.join(backupFolder, filename);

    const MYSQL_USER = "root";
    const MYSQL_PASS = "";
    const MYSQL_DB = "iconscribe";
    const MYSQLDUMP_PATH = `"C:\\xampp\\mysql\\bin\\mysqldump.exe"`;

    // Build the mysqldump command
    const dumpCommand =
      MYSQL_PASS === ""
        ? `${MYSQLDUMP_PATH} -u ${MYSQL_USER} ${MYSQL_DB} > "${filepath}"`
        : `${MYSQLDUMP_PATH} -u ${MYSQL_USER} -p${MYSQL_PASS} ${MYSQL_DB} > "${filepath}"`;

    // Run the command
    exec(dumpCommand, (err, stdout, stderr) => {
      if (err) {
        console.error("Backup failed:", stderr || err);
        return res.status(500).json({ success: false, message: "Backup failed" });
      }

      // Get file size
      const stats = fs.statSync(filepath);
      const sizeMB = (stats.size / 1024 / 1024).toFixed(2) + " MB";

      // Save log
      db.query(
        "INSERT INTO backup_history (filename, scope, size, status) VALUES (?, ?, ?, ?)",
        [filename, req.body.scope || "All", sizeMB, "Success"]
      );

      res.json({ success: true, message: "Backup created successfully", filename });
    });
  } catch (err) {
    console.error("Backup failed:", err);
    res.status(500).json({ success: false, message: "Backup failed" });
  }
});



/* =====================================================
 LIST ALL BACKUPS
===================================================== */
router.get("/list-db", (req, res) => {
  db.query("SELECT * FROM backup_history ORDER BY created_at DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch backups" });
    res.json(rows);
  });
});

/* =====================================================
 DOWNLOAD BACKUP
===================================================== */
router.get("/download/:filename", (req, res) => {
  const filePath = path.join(backupFolder, req.params.filename);
  if (!fs.existsSync(filePath))
    return res.status(404).json({ success: false, message: "File not found" });

  res.download(filePath);
});

/* =====================================================
 DELETE BACKUP
===================================================== */
router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;

  db.query("SELECT filename FROM backup_history WHERE id = ?", [id], (err, results) => {
    if (err || results.length === 0)
      return res.status(404).json({ success: false, message: "Backup not found" });

    const filePath = path.join(backupFolder, results[0].filename);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    db.query("DELETE FROM backup_history WHERE id = ?", [id]);

    res.json({ success: true, message: "Backup deleted" });
  });
});

/* =====================================================
   RESTORE DATABASE
===================================================== */
router.post("/restore", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;
  const filename = req.file.originalname;

  try {
    // Step 1: Backup current database before restore
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}-${now.getTime()}`;
    const backupBeforeRestore = path.join(backupFolder, `pre-restore-${timestamp}.sql`);
    await execBackup(backupBeforeRestore);

    // Step 2: Restore using mysql.exe
    const MYSQL_USER = "root";
    const MYSQL_PASS = "";
    const MYSQL_DB = "iconscribe";
    const MYSQL_PATH = `"C:\\xampp\\mysql\\bin\\mysql.exe"`; // adjust if needed

    const restoreCommand =
      MYSQL_PASS === ""
        ? `${MYSQL_PATH} -u ${MYSQL_USER} ${MYSQL_DB} < "${filePath}"`
        : `${MYSQL_PATH} -u ${MYSQL_USER} -p${MYSQL_PASS} ${MYSQL_DB} < "${filePath}"`;

    exec(restoreCommand, (err) => {
      fs.unlinkSync(filePath); // remove uploaded file

      const status = err ? "Failed" : "Success";

      db.query(
        "INSERT INTO restore_history (filename, performed_by, status) VALUES (?, ?, ?)",
        [filename, "Admin", status]
      );

      if (err) {
        console.error("Restore error:", err);
        return res.status(500).json({ success: false, message: "Restore failed" });
      }

      res.json({ success: true, message: "Database restored safely. Pre-restore backup created." });
    });
  } catch (err) {
    console.error("Safe restore failed:", err);
    res.status(500).json({ success: false, message: "Restore failed" });
  }
});



/* =====================================================
 LIST RESTORE HISTORY
===================================================== */
router.get("/restore/list-db", (req, res) => {
  db.query("SELECT * FROM restore_history ORDER BY restored_at DESC", (err, rows) => {
    if (err) return res.json([]);
    res.json(rows);
  });
});

module.exports = router;
