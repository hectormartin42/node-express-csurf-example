var express = require('express')
var router = express.Router()

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('List of users')
})

router.post('/add', function (req, res, next) {
  res.render('user-added', { title: 'User added', csrfToken: req.body._csrf })
})

module.exports = router
