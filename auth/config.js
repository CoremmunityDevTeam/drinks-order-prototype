const passport = require('passport');
const TwitchStrategy = require('passport-twitch-new').Strategy;

passport.use(new TwitchStrategy({
    clientID: process.env.TWITCH_CLIENT_ID,
    clientSecret: process.env.TWITCH_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    scope: 'user_read'
},
function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

function initAuthentication(app) {
    app.use(passport.initialize());
    app.use(passport.session());
}

module.exports = {
    initAuthentication,
    passport
};
