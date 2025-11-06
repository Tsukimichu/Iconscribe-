const express = require("express");
const router = express.Router();
const db = require("../models/db"); // MySQL connection

// -------------------- GET messages --------------------
router.get("/messages/:conversationId", (req, res) => {
  const conversationId = req.params.conversationId;

  db.query(
    "SELECT * FROM messages WHERE conversationId = ? ORDER BY createdAt ASC",
    [conversationId],
    (err, results) => {
      if (err) {
        console.error("❌ Error fetching messages:", err);
        return res.status(500).json({ message: "Database error" });
      }

      // Add 'time' field for frontend
      const formatted = results.map(msg => ({
        ...msg,
        time: msg.createdAt,
      }));

      res.json(formatted);
    }
  );
});

// -------------------- POST conversation --------------------
router.post("/conversations", (req, res) => {
  const { clientId, managerId } = req.body;

  db.query(
    "SELECT * FROM conversations WHERE clientId = ? AND managerId = ?",
    [clientId, managerId],
    (err, results) => {
      if (err) {
        console.error("❌ Error fetching conversation:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length > 0) {
        res.json(results[0]);
      } else {
        db.query(
          "INSERT INTO conversations (clientId, managerId) VALUES (?, ?)",
          [clientId, managerId],
          (err, result) => {
            if (err) {
              console.error("❌ Error creating conversation:", err);
              return res.status(500).json({ message: "Database error" });
            }
            res.json({ id: result.insertId, clientId, managerId });
          }
        );
      }
    }
  );
});

// -------------------- GET conversations by manager --------------------
router.get("/conversations/:managerId", (req, res) => {
  const managerId = req.params.managerId;

  const query = `
    SELECT 
      c.id,
      c.clientId,
      u.name AS clientName,
      m.text AS lastMessage
    FROM conversations c
    LEFT JOIN users u ON c.clientId = u.user_id
    LEFT JOIN messages m ON m.id = (
        SELECT id FROM messages 
        WHERE conversationId = c.id 
        ORDER BY createdAt DESC 
        LIMIT 1
    )
    WHERE c.managerId = ?
    ORDER BY c.id DESC
  `;

  db.query(query, [managerId], (err, results) => {
    if (err) {
      console.error("❌ Error loading conversations:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
});

// -------------------- POST message --------------------
router.post("/messages", (req, res) => {
  const { conversationId, senderId, text } = req.body;

  db.query(
    "INSERT INTO messages (conversationId, senderId, text) VALUES (?, ?, ?)",
    [conversationId, senderId, text],
    (err, result) => {
      if (err) {
        console.error("❌ Error saving message:", err);
        return res.status(500).json({ message: "Database error" });
      }

      const message = {
        id: result.insertId,
        conversationId,
        senderId,
        text,
        createdAt: new Date().toISOString(),
      };

      // Emit via Socket.IO
      const io = req.app.get("io");
      if (io) io.to(`room_${conversationId}`).emit("receiveMessage", message);

      res.json(message);
    }
  );
});

module.exports = router;


