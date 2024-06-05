require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const { initAuthentication } = require('./auth/config');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// Passport initialisieren
initAuthentication(app);

app.use('/auth', require('./auth/auth-routes'));
app.use('/api', require('./api/api-routes'));
app.use('/', require('./routes'));

// Start des Servers
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});
