if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt') // needed to facilitate password hashing
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const initialisePassport = require('./passport.config')
initialisePassport(
    passport, 
    email => users.find(user => user.email === email), 
    id => users.find(user => user.id === id)
)

const users = [] /* where we're storing our users (for now, this will be upgraded to integrate the PostgreSQL DB later) */
// when app reloads, all users are gone, because this is all saved in memory, so connecting the DB will most likely be the next natural step here

app.set('view-engine', 'ejs')
app.use(express.urlencoded( { extended: false })) // allows us to take the forms in our ejs files and then be able to access them inside of our request variable inside of our POST method
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(express.json()) // allows our application to accept JSON

app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name })
});

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
});

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashed_password = await bcrypt.hash(req.body.password, 10);
        
        users.push ({ // only using this for this tutorial because when connecting a DB, this is automatically done for you
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashed_password
        }); 
        res.redirect('/login') // redirect to login page so user can login with the account they just registered
    } catch {
        res.redirect('/register') // redirect to register in case of a failure
    }
    console.log(users)
});

// User authentication
app.get('/users', (req, res) => { //request, response
    res.json(users) //send our users
});

/* handles for creating a user, hashing the password they send, and saving this into our users variable (list) */
app.post('/users', async (req, res) => {
    try {
        const hashed_password = await bcrypt.hash(req.body.password, 10) // 10 by default
        const user = { name: req.body.name, password: hashed_password }
        users.push(user)
        res.status(201).send() // sends a blank response back to the user
        // hash(salt + 'password') - salt is a unique, random string generated for each password. without it, identical passwords produce identical hashes. we don't have to use this line of code here, its more of an example, for this project, we will use bcrypt
    } catch { // in case something goes wrong
        res.status(500).send()
    }
});

app.post('/users/login', async(req, res) => {
    const user = users.find(user => user.name = req.body.name) // trying to find a particular user based on the name we pass in
    if (user == null) { // if user does not exist
        return res.status(400).send('Cannot find user')
    }

    try {
        if (await bcrypt.compare(req.body.password, user.password)) { //user.password is the hashed version of the password, where this if statement checks if the passwords are the same, and if they are, then the user is logged in
            res.status(500).send() // success
        } else {
            res.send('Not allowed')
        }
    } catch {
        res.status(500).send()
    }
});

app.delete('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) {
            return next(err)
        }
        res.redirect('/login');
    })
});

//middleware function
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})