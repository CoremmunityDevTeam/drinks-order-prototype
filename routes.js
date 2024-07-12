const express = require('express');
const router = express.Router();
const path = require('path');

// Middleware zur Überprüfung der Authentifizierung
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function isAdminUser(req)  { 
    return process.env.ADMIN_USERS.split(',').includes(req.session.username) 
}

function ensureAdmin(req, res, next){
    if (req.isAuthenticated() && isAdminUser(req)) {
        return next();
    }
    res.redirect('/');
}

// Route für die Startseite
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route für die Bestellung
router.get('/order', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'order.html'));
});

// Route für Logout
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy();
        res.redirect('/');
    });
});

// Route für die Admin-Seite
router.get('/admin', ensureAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

module.exports = router;
