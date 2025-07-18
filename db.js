db.serialize(() => {
  // Booking table
  db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      car TEXT NOT NULL,
      pickup TEXT NOT NULL,
      dropoff TEXT NOT NULL
    )
  `);

  // Admin table
  db.run(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

  // Create default admin if not exists
  db.get("SELECT * FROM admins WHERE username = ?", ["admin"], (err, row) => {
    if (!row) {
      db.run("INSERT INTO admins (username, password) VALUES (?, ?)", [
        "admin",
        "admin123", // 🔐 You should hash this in production!
      ]);
    }
  });
});
