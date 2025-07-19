const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const db = require("./db");
const path = require("path");
const app = express();

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");

// Create bookings table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    car TEXT,
    pickup TEXT,
    dropoff TEXT
  )
`);


app.use(express.static("public")); //wherever static files are
app.use(express.urlencoded({ extended: true })); //This is required to parse form data

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
      if (err || !row) {
        req.session.error = "Invalid username or password.";
        return res.json({ success: false });
}
      req.session.admin = true;
      req.session.error = null;
      res.json({ success: true });
    }
  );
});

app.get("/login/error", (req, res) => {
  const error = req.session.error;
  req.session.error = null; // Clear after sending
  res.json({ error });
});


// This protects admin.html from direct access
app.get("/admin.html", (req, res) => {
  if (req.session.admin) {
    res.sendFile(path.join(__dirname, "admin.html"));
  } else {
    res.redirect("/login.html");
  }
});

// Middleware to protect admin
app.use("/admin.html", (req, res, next) => {
  if (req.session.admin) {
    res.sendFile(path.join(__dirname, "public", "admin.html"));
  } else {
    res.redirect("/login.html");
  }
});

//API:Change Password
app.post("/change-password", (req, res) => {
  const { username, oldPassword, newPassword } = req.body;

  db.get(
    "SELECT * FROM admins WHERE username = ? AND password = ?",
    [username, oldPassword],
    (err, row) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Server error." });
      }

      if (!row) {
        return res.status(401).json({ success: false, message: "Old password is incorrect." });
      }

      db.run(
        "UPDATE admins SET password = ? WHERE username = ?",
        [newPassword, username],
        (err2) => {
          if (err2) {
            return res.status(500).json({ success: false, message: "Password update failed." });
          }

          res.json({ success: true, message: "Password changed successfully." });
        }
      );
    }
  );
});


// API: Add Booking
app.post("/bookings", (req, res) => {
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

app.post("/book", (req, res) => {
  const { car, pickup, dropoff } = req.body;
  db.run("INSERT INTO bookings (car, pickup, dropoff) VALUES (?, ?, ?)", [car, pickup, dropoff], (err) => {
    if (err) return res.status(500).send("Failed to book");
    res.send("Booking successful");
  });
});


// API: Get Bookings (secured)
app.get("/bookings", (req, res) => {
  if (!req.session.admin) return res.status(403).json({ error: "Unauthorized" });
  db.all(`SELECT * FROM bookings`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API: Delete Booking (secured)
app.delete("/bookings/:id", (req, res) => {
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
