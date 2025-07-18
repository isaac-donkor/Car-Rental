const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");
const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));

// Add booking
app.post("/api/bookings", (req, res) => {
  const { car, pickup, dropoff } = req.body;
  db.run(
    `INSERT INTO bookings (car, pickup, dropoff) VALUES (?, ?, ?)`,
    [car, pickup, dropoff],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ id: this.lastID });
    }
  );
});

// Get all bookings
app.get("/api/bookings", (req, res) => {
  db.all(`SELECT * FROM bookings`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Delete booking
app.delete("/api/bookings/:id", (req, res) => {
  db.run(`DELETE FROM bookings WHERE id = ?`, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ success: true });
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
