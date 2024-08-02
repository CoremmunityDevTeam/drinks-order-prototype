const path = require('path')
const sqlite3 = require('sqlite3').verbose();

// SQLite Verbindung
const dbFile = path.resolve(__dirname, 'getraenke.db');
console.log("Connect to DB: "+ dbFile);
const db = new sqlite3.Database(dbFile);

module.exports = db;