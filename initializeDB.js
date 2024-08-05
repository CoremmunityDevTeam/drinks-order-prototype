const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname + "/.env") });
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('getraenke.db');

db.serialize(() => {
    // Tabelle für Bestellungen
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        drink TEXT NOT NULL,
        price REAL NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabelle für Events
    db.run(`CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        start_time DATETIME NOT NULL,
        end_time DATETIME NOT NULL
    )`);

    // Tabelle für Sessions
    db.run(`CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_name TEXT NOT NULL UNIQUE,
        user_kind TEXT NOT NULL
    )`);

    process.env.ADMIN_USERS.split(',').forEach((user_name) => {
        db.run(`INSERT OR IGNORE INTO users(user_name, user_kind) VALUES (?,'Administrator')`, [user_name]);
    });
});

db.close();
console.log('Database initialized');
