const router = require('express').Router();
const db = require('../database');


function isAdminUser(req)  { 
    return process.env.ADMIN_USERS.split(',').includes(req.session.username) 
}
// Middleware zur Überprüfung der Authentifizierung
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function ensureAdmin(req, res, next){
    if (req.isAuthenticated() && isAdminUser(req)) {
        return next();
    }
    res.status(403).send('Access denied');
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
    db.all('SELECT drink, price, datetime(created_at) as created_at FROM orders WHERE name = ?', [name], (err, rows) => {
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
router.get('/all-orders', ensureAdmin, (req, res) => {
    db.all('SELECT id, name, drink, price, datetime(created_at) as created_at FROM orders', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

router.delete('/orders/:id', ensureAdmin, (req, res) => {
    db.run('DELETE FROM orders WHERE id =?', [req.params.id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
         }
        res.sendStatus(204);
     });
});

// Route, um den Benutzernamen aus der Session zu holen
router.get('/get-username', (req, res) => {
    if (req.session.username) {
        res.json({ username: req.session.username, admin: isAdminUser(req) });
    } else {
        res.json({ username: null });
    }
});

// Route, um alle Events abzurufen
router.get('/events', (req, res) => {
    db.all('SELECT id, title, start_time, end_time FROM events', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Route, um ein neues Event zu erstellen
router.post('/events', ensureAdmin, (req, res) => {
    const { title, start_time, end_time } = req.body;
    db.run('INSERT INTO events (title, start_time, end_time) VALUES (?, ?, ?)', [title, start_time, end_time], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID, title, start_time, end_time });
    });
});

router.delete('/events/:id', ensureAdmin, (req, res) => {
    db.run('DELETE FROM events WHERE id =?', [req.params.id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
         }
        res.sendStatus(204);
     });
});

router.get('/checkout', ensureAuthenticated, (req, res) => {
    const name = req.session.username; 
    db.get('SELECT sum(price) as total FROM orders WHERE name = ?', [name], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.redirect(process.env.PAYPAL_LINK+ result['total']);
    });
});



module.exports = router;
