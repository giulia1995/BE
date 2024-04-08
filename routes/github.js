const express = require(`express`);
const github = express.Router();
const GithubStrategy = require(`passport-github`).Strategy;
const jwt = require(`jsonwebtoken`);
const session = require(`express-session`);
const passport = require(`passport`);
require(`dotenv`).config();

// Set up session middleware
github.use(
    session({
        secret: process.env.GITHUB_CLIENT_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

// Initialize passport middleware
github.use(passport.initialize());
github.use(passport.session());

// Serialize and deserialize user for session management
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Configure Github OAuth2 strategy
passport.use(
    new GithubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
    }, (accessToken, refreshToken, profile, done) => {
        // Log user profile retrieved from Github
        console.log(profile);
        return done(null, profile);
    })
);

// Endpoint for initiating Github OAuth2 authentication
github.get(`/auth/github`, passport.authenticate(`github`, { scope: [`user:email`] }), (req, res) => {
    // Redirect to client application with user profile after authentication
    const redirectUrl = `${process.env.FE_URL}/success?user=${encodeURIComponent(JSON.stringify(req.user))}`;
    res.redirect(redirectUrl);
});

// Callback endpoint for handling Github OAuth2 callback after authentication
github.get(`/auth/github/callback`, passport.authenticate(`github`, { failureRedirect: `/` }), (req, res) => {
    // Generate JWT token from authenticated user and redirect to client application
    const user = req.user;
    console.log(`USER LOG`, user);

    const token = jwt.sign(user, process.env.SECRET_KEY);
    const redirectUrl = `${process.env.FE_URL}/success?token=${encodeURIComponent(token)}`;
    res.redirect(redirectUrl);
});

// Redirect endpoint after successful authentication
github.get(`/success`, (req, res) => {
    res.redirect(`${process.env.FE_URL}/home`);
});

module.exports = github;
