const router = require('express').Router();
const { passport } = require('./config');

// Setup authentication routes
router.get('/twitch', passport.authenticate('twitch'));
router.get('/twitch/callback', passport.authenticate('twitch', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication
        console.log('Successful Authentication: ' + req.user.display_name);
        req.session.username = req.user.display_name;
        res.redirect('/');
    }
);

module.exports = router;
