const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const db = require("./db");
const path = require("path");

const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));

app.use(session({
  secret: "secureSecretKey123", // 🔐 Change this in production
  resave: false,
  saveUninitialized: false
}));

// Login endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.get(
    "SELECT * FROM admins WHERE username = ? AND password = ?",
    [username, password],
    (err, row) => {
      if (err || !row) return res.json({ success: false });
      req.session.admin = true;
      res.json({ success: true });
    }
  );
});

// Middleware to protect admin
app.use("/admin.html", (req, res, next) => {
  if (req.session.admin) {
    res.sendFile(path.join(__dirname, "public", "admin.html"));
  } else {
    res.redirect("/login.html");
  }
});

// API: Add Booking
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

// API: Get Bookings (secured)
app.get("/api/bookings", (req, res) => {
  if (!req.session.admin) return res.status(403).json({ error: "Unauthorized" });
  db.all(`SELECT * FROM bookings`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API: Delete Booking (secured)
app.delete("/api/bookings/:id", (req, res) => {
  if (!req.session.admin) return res.status(403).json({ error: "Unauthorized" });
  db.run(`DELETE FROM bookings WHERE id = ?`, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ success: true });
  });
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login.html");
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
