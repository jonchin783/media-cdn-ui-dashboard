// app/routes.js
module.exports = function (app, passport) {
    var request = require("request");
    var bodyParser = require('body-parser');
    var api_controller = require('./controllers/api-controller');
    app.use(bodyParser());

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') }); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================

    app.post('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('console-home.ejs', {user : req.user});
    });

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.get('/', isLoggedIn, function (req, res) {
        console.log('Reached the routes.js');
        res.render('getting-started.ejs', { user : req.user });
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/api/getAccessToken', api_controller.getAccessToken);
    app.get('/api/getProjectId', api_controller.getProjectId);
    app.post('/api/getEdgeCacheServices', api_controller.getEdgeCacheServices);
    app.post('/api/getEdgeCacheOrigins', api_controller.getEdgeCacheOrigins);
    app.post('/api/dummy', api_controller.dummy);
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }
    // if they aren't redirect them to the home page
    res.redirect('/');
}
