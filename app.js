var express = require('express')
var path = require('path')
var nunjucks = require('express-nunjucks')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var csurf = require('csurf')

var routes = require('./routes/index')
var users = require('./routes/users')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'html')

app.set('view engine', 'html')
app.set('views', path.join(__dirname, 'views'))

nunjucks(app)

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

// Use cookie parser middleware (required for csurf)
app.use(cookieParser({
  secret: 'test'
}))
app.use(csurf({ cookie: true }))

// Generate token for all get requests
app.get('/', function (req, res, next) {
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use('/', routes)
app.use('/users', users)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers
app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)

  // handle CSRF token errors here
  res.status(403)
  res.render('error', {
    message: 'CODE RED - NO CSRF TOKEN',
    error: {}
  })
})

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

module.exports = app
