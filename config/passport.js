const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

module.exports = app => {
  // initialize
  app.use(passport.initialize())
  app.use(passport.session())

  // local login
  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true },
    (req, email, password, done) => {
      User.findOne({ email })
        .then(user => {
          if (!user) { return done(null, false, req.flash('login_msg', 'That email is not registered!')) }
          if (user.password !== password) { return done(null, false, req.flash('login_msg', 'Email or Password incorrect.')) }
          return done(null, user)
        })
        .catch(error => done(error, false))
    }
  ))

  // serialize & deserialize
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    // query database
    User.findById(id)
      .lean()
      .then(user => {
        done(null, user)
      })
      .catch(err => done(err, null))
  })
}