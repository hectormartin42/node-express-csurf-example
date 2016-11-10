var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var csurf = require('csurf')
var expect = require('chai').expect
var express = require('express')
var request = require('supertest')
var path = require('path')
var app = express()
var locals

// Setup app middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser({
  secret: 'test'
}))
app.use(csurf({ cookie: true }))
app.get('*', function (req, res, next) {
  res.locals.csrfToken = req.csrfToken()
  next()
})

// Setup app view engine
app.engine('html', function (filePath, options, callback) {
  var rendered = `${filePath}: ${options}`
  // save locals for this request
  locals = options._locals
  return callback(null, rendered)
})
app.set('view engine', 'html')
app.set('views', [ path.join(__dirname, '../../views') ])

// Setup app routes
var routes = require('../../routes/index')
var users = require('../../routes/users')
app.use('/', routes)
app.use('/users', users)

// Tests
describe('routes/index', function () {
  describe('GET /', function () {
    it('should respond with a 200', function () {
      return request(app)
        .get('/')
        .expect(200)
    })

    it('should add a csrf token', function () {
      request(app)
        .get('/')
        .end(function (err, res) {
          if (err) console.dir(err)
          expect(locals).to.have.property('csrfToken')
        })
    })
  })

  describe('GET /malicious-page', function () {
    it('should respond with a 200', function () {
      request(app)
        .get('/malicious-page')
        .expect(200)
    })
  })
})
