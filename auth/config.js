// Initialize Passport and restore authentication state, if any, from the session
function initAuthentication(app) {
app.use(passport.initialize());
app.use(passport.session());
}

module.exports = {
    initAuthentication
}

