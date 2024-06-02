const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('getraenke.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        drink TEXT NOT NULL,
        price REAL NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`);
});

db.close();
console.log('Database initialized');
