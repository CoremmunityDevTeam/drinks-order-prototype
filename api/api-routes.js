const router = require('express').Router();
const db = require('../database');

// Middleware zur Überprüfung der Authentifizierung
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

// Route, um das Admin-Passwort zu überprüfen
router.post('/check-password', (req, res) => {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSWORD) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// Route, um alle Bestellungen eines Benutzers abzurufen
router.get('/orders', ensureAuthenticated, (req, res) => {
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
router.post('/orders', ensureAuthenticated, (req, res) => {
    const { name, drink } = req.body;
    const priceMap = {
        'Bier': 1.80,
        'Softgetränk': 2.50,
        'Wasser': 1.20
    };
    const price = priceMap[drink];
    db.run('INSERT INTO orders (name, drink, price) VALUES (?, ?, ?)', [name, drink, price], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID, name, drink, price });
    });
});

// Route, um alle Bestellungen abzurufen (für Admin-Seite)
router.get('/all-orders', ensureAuthenticated, (req, res) => {
    db.all('SELECT name, drink, price, strftime("%d.%m.%Y %H:%M", created_at) as created_at FROM orders', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Route, um den Benutzernamen aus der Session zu holen
router.get('/get-username', (req, res) => {
    if (req.session.username) {
        res.json({ username: req.session.username });
    } else {
        res.json({ username: null });
    }
});

// Route, um alle Events abzurufen
router.get('/events', (req, res) => {
    db.all('SELECT title, strftime("%d.%m.%Y %H:%M", start_time) as start_time, strftime("%d.%m.%Y %H:%M", end_time) as end_time FROM events', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Route, um ein neues Event zu erstellen
router.post('/events', ensureAuthenticated, (req, res) => {
    const { title, start_time, end_time } = req.body;
    db.run('INSERT INTO events (title, start_time, end_time) VALUES (?, ?, ?)', [title, start_time, end_time], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID, title, start_time, end_time });
    });
});

module.exports = router;
