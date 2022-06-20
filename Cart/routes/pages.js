const express = require('express')
const router = express.Router()

// ROUTES
router.get('/', (req, res) => {
  res.render('index', {
    title: 'HOME'
  });
});

router.get('/test', (req, res) => {
  res.send('TEST!!!')
});

router.get('/contact', (req, res) => {
  res.send('CONTACT!!!')
});

// EXPORTS
module.exports = router