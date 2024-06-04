const router = require('express').Router();
const path = require('path');

// Admin-Seite bereitstellen
router.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin.html'));
});

// Route für Logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy();
        res.redirect('/');
    });
});

// Route für die Getränkebestellung
router.get('/order', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/order.html'));
});

module.exports = router;
