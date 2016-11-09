var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Valid page', csrfToken: req.csrfToken() })
})

/* GET malicious page. */
router.get('/malicious-page', function (req, res, next) {
  res.render('malicious-page', { title: 'Malicious page' })
})

module.exports = router
