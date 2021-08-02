const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../../models/user')

// login page view
router.get('/login', (req, res) => {
  res.render('login')
})

// login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

// logout
router.get('/logout', (req, res) => {
  req.logout()
  console.log('logout successful!')
  res.redirect('/users/login')
})

// register page view
router.get('/register', (req, res) => {
  res.render('register')
})

// register
router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  User.findOne({ email })
    .then(user => {
      // user email 已經註冊過
      if (user) {
        console.log('User already exists.')
        return res.render('register', { name, email, password, confirmPassword })
      } else {
        return User.create({
          name,
          email,
          password,
        })
          .then(() => res.redirect('/'))
          .catch(error => console.log(error))
      }
    })
})

module.exports = router