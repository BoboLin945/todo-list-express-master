const express = require('express')
const router = express.Router()

// login page view
router.get('/login', (req, res) => {
  res.render('login')
})

// login
router.post('/login', (req, res) => {
  
})

// register page view
router.get('/register', (req, res) => {
  res.render('register')
})

module.exports = router