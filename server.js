const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// SQLite Verbindung
const db = new sqlite3.Database('getraenke.db');

// Passwort für Admin-Zugang
const ADMIN_PASSWORD = 'CoreDev';

// Route, um das Admin-Passwort zu überprüfen
app.post('/api/check-password', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// Route, um alle Bestellungen eines Benutzers abzurufen
app.get('/api/orders', (req, res) => {
    const name = req.query.name;
    db.all('SELECT drink, price, strftime("%d.%m.%Y %H:%M", created_at) as created_at FROM orders WHERE name = ?', [name], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Route, um eine neue Bestellung zu erstellen
app.post('/api/orders', (req, res) => {
    const { name, drink } = req.body;
    const priceMap = {
        'Bier': 1.80,
        'Softgetränk': 2.50,
        'Wasser': 1.20
    };
    const price = priceMap[drink];
    db.run('INSERT INTO orders (name, drink, price) VALUES (?, ?, ?)', [name, drink, price], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID, name, drink, price });
    });
});

// Admin-Seite bereitstellen
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin.html'));
});

// Route, um alle Bestellungen abzurufen (für Admin-Seite)
app.get('/api/all-orders', (req, res) => {
    db.all('SELECT name, drink, price, strftime("%d.%m.%Y %H:%M", created_at) as created_at FROM orders', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Start des Servers
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});
