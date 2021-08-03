const express = require('express')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const router = express.Router()
const User = require('../../models/user')

// login page view
router.get('/login', (req, res) => {
  res.render('login')
})

// login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))

// logout
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '成功登出！')
  res.redirect('/users/login')
})

// register page view
router.get('/register', (req, res) => {
  res.render('register')
})

// register
router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '所有欄位皆為必填！' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！' })
  }
  if (errors.length) {
    return res.render('register', { name, email, password, confirmPassword, errors })
  }
  User.findOne({ email })
    .then(user => {
      // user email 已經註冊過
      if (user) {
        errors.push({ message: 'User already exists.' })
        return res.render('register', { name, email, password, confirmPassword, errors })
      } else {
        bcrypt.genSalt(10)
          .then((salt) => bcrypt.hash(password, salt))
          .then((hash) => {
            User.create({
              name,
              email,
              password: hash
            })
          })
          .then(() => res.redirect('/'))
          .catch(error => console.log(error))
      }
    })
})

module.exports = router