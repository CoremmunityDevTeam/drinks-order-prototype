const router = require('express').Router();
const passport = require('passport');
const TwitchStrategy = require('passport-twitch-new').Strategy;

// Setup authentication
passport.use(new TwitchStrategy({
    clientID: process.env.TWITCH_CLIENT_ID,
    clientSecret: process.env.TWITCH_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    scope: 'user_read'
},
function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
}));

// Configure Passport authenticated session persistence
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

router.get('/twitch', passport.authenticate('twitch'));
router.get('/twitch/callback', passport.authenticate('twitch', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication
        req.session.username = req.user.display_name;
        res.redirect('/');
    }
);

module.exports = router;
