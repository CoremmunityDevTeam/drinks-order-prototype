const router = require('express').Router();
const db = require('../database');

async function isUserOfType(user_name, type) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT user_name FROM users WHERE user_name = ? AND user_kind = ?`, [user_name.trim(), type], (err, rows) => {
            if(err) {
                reject();
            }
            if(rows.length > 0) {
                resolve(true);
            }
            resolve(false);
        })
    })
}

async function isAdminUser(req)  {
    if(!req) {
        return false;
    }
    return await isUserOfType(req.session.username, 'Administrator');
}

async function isRegisteredUser(req)  {
    if(!req) {
        return false;
    }
    return await isUserOfType(req.session.username, 'Angemeldeter Besucher:in')
}

// Middleware zur Überprüfung der Authentifizierung
async function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated() && (await isRegisteredUser(req) || await isAdminUser(req))) {
        return next();
    }
    res.redirect('/');
}

async function ensureAdmin(req, res, next){
    if (req.isAuthenticated() && await isAdminUser(req)) {
        return next();
    }
    res.status(403).send('Access denied');
}


// Kann entfernt werden, da auf User umgestellt wurde - K4ninchen 05.08 
// Route, um das Admin-Passwort zu überprüfen
//router.post('/check-password', (req, res) => {
//    const { password } = req.body;
//    if (password === process.env.ADMIN_PASSWORD) {
//      res.json({ success: true });
//    } else {
//        res.json({ success: false });
//    }
//});

router.get('/accessCode', ensureAuthenticated, (req, res) => {
    res.json({accessCode: process.env.ACCESS_CODE});
});

// Route, um alle Bestellungen eines Benutzers abzurufen
router.get('/orders', ensureAuthenticated, (req, res) => {
    const name = req.query.name;
    db.all("SELECT drink, price, datetime(created_at,'localtime') as created_at FROM orders WHERE name = ?", [name], (err, rows) => {
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
    db.all("SELECT id, name, drink, price, datetime(created_at,'localtime') as created_at FROM orders", (err, rows) => {
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
router.get('/get-username', async (req, res) => {
    if (req.session.username) {
        res.json({ username: req.session.username, admin: await isAdminUser(req), registeredUser: await isRegisteredUser(req)});
    } else {
        res.json({ username: null });
    }
});

// Route, um alle Events abzurufen
router.get('/events/date', (req,res) => {
    db.all("SELECT distinct STRFTIME('%d.%m.', start_time) as date, STRFTIME('%d-%m-%Y', start_time) as search FROM events order by start_time asc", (err, rows) => {
        if (err){
            res.status(500).json({error: err.message})
            return;
        }
        res.json(rows);
    });
});

router.get('/events/date/:date', (req, res) => {
    db.all(`SELECT id, title, start_time, end_time FROM events WHERE STRFTIME('%d-%m-%Y', start_time) = '${req.params.date}' order by start_time asc`, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});


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


router.get('/users', (req, res) => {
    db.all('SELECT id, user_name, user_kind FROM users', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

router.post('/users', ensureAdmin, (req, res) => {
    const { user_name, user_kind } = req.body;
    db.run('INSERT INTO users (user_name, user_kind) VALUES (?, ?)', [user_name.trim(), user_kind], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID, user_name, user_kind });
    });
});

router.delete('/users/:id', ensureAdmin, (req, res) => {
    db.run('DELETE FROM users WHERE id =?', [req.params.id], function (err) {
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
