const sqlite3 = require('sqlite3').verbose();

// SQLite Verbindung
const db = new sqlite3.Database('getraenke.db');
module.exports = db;