const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.sqlite");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      car TEXT NOT NULL,
      pickup TEXT NOT NULL,
      dropoff TEXT NOT NULL
    )
  `);
});

module.exports = db;
