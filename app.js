var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');

var index = require('./routes/index');
var login = require('./routes/login');
var logout = require('./routes/logout');
var register = require('./routes/register');
var passRecover = require('./routes/pass_recover');
var dressesCloset = require('./routes/dresses_closet');
var dressesWishes = require('./routes/dresses_wishes');
var dressesMycloset = require('./routes/dresses_mycloset');
var dressView = require('./routes/dress_view');
var dressUpdate = require('./routes/dress_update');
var dressImages = require('./routes/dress_images');
var dressPublish = require('./routes/dress_publish');
var dressBuy = require('./routes/dress_buy');
var dressCreate = require('./routes/dress_create');
var users = require('./routes/users');
var userProfile = require('./routes/user_profile');
var userView = require('./routes/user_view');
var userUpdate = require('./routes/user_update');
var userImages = require('./routes/user_images');
var userPassChange = require('./routes/user_pass_change');
// var userCreate = require('./routes/user_create');
var messages = require('./routes/messages');
var messageView = require('./routes/message_view');

var session = expressSession({
    secret: 'lkjsfffws',
    key: 'sessionServidor',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30
    }
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session);
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    console.log('****** (global dresses) ATENDIENDO LA RUTA: ' + req.url + ' METODO: ' + req.method);

    if (req.method === 'GET') {
        if (req.url !== '/login') {
            req.session.lastUrlGet = req.url;
            console.log('****** (global dresses) Guardada la ruta: ' + req.session.lastUrlGet);
        }
    }

    next();
});

console.log('(APP.JS) Cargando rutas.');
app.use('/', index);
app.use('/login', login);
app.use('/logout', logout);
app.use('/register', register);
app.use('/pass_recover', passRecover);
app.use('/dresses', dressesCloset);
app.use('/dresses', dressesWishes);
app.use('/dresses', dressesMycloset);
app.use('/dresses', dressView);
app.use('/dresses', dressUpdate);
app.use('/dresses', dressImages);
app.use('/dresses', dressPublish);
app.use('/dresses', dressBuy);
app.use('/dresses', dressCreate);
app.use('/users', users);
app.use('/users', userProfile);
app.use('/users', userView);
app.use('/users', userUpdate);
app.use('/users', userImages);
app.use('/users', userPassChange);
// app.use('/users', userCreate);
app.use('/messages', messages);
app.use('/messages', messageView);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
