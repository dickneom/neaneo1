/* cSpell:disable */
/* jslint node: true */

// /routes/login.js

var express = require('express');
var router = express.Router();

var db = require('../models/db');
var controlUser = require('../control/users');
var controlSession = require('../control/session');

/**
/ Metdodo GET para la ruta /login
*/
router.get('/', function(req, res, next) {
    res.render('login/login', {
        title: 'Node es una mierda, y mas mierda y mas mierda',
        pageTitle: 'Ingreso',
        pageName: 'login',
        sessionUser: null,
        errors: null
    });
});

/**
/ Metodo post para la ruta /login
*/
router.post('/', function(req, res, next) {
    var error;
    var email = req.body.email;
    var password = req.body.password;
    var rememberme = req.body.rememberme ? true : false;

    controlUser.encryptPassword(password, function(passEncrypt) {
        controlSession.login(req, res, email, passEncrypt, rememberme, function(errors) {
            if (errors) {
                console.log('(LOGIN.JS) ****** ERROR:', errors);
                res.render('login/login', {
                    pageTitle: 'Ingreso',
                    pageName: 'login',
                    sessionUser: null,
                    errors: [errors]
                });
            } else {
                if (req.session.userLoged.isAuthenticated) {
                    console.log('(LOGIN.JS) ****** Usuario validado y autentidado');
                } else {
                    error = 'Usuario validado pero no autentidado';
                    console.log('(LOGIN.JS) *** ERROR:', error);
                }

                console.log('(LOGIN.JS) ****** Redireccionando a: ' + req.session.lastUrlGet);
                if (req.session.lastUrlGet) {
                    res.redirect(req.session.lastUrlGet);
                } else {
                    res.redirect('/');
                }
            }
        });
    });
    /*  controlUser.encryptPassword(password, function (passEncrypt) {
        db.User.findOne({
          where: {
            email: email,
            password: passEncrypt
          }
        }).then(function (user) {
          if (user) {
            if (user.authenticated) {
              console.log('(LOGIN.JS) ****** Usuario validado y autentidado')
              controlSession.sessionInit(req, res, user, rememberme)

              console.log('(LOGIN.JS) ****** Redireccionando a: ' + req.session.lastUrlGet)
              if (req.session.lastUrlGet) {
                res.redirect(req.session.lastUrlGet)
              } else {
                res.redirect('/')
              }
            } else {
              error = 'Usuario validado pero no autentidado'
              console.log('(LOGIN.JS) *** ERROR: ' + error)
              res.render('login/login', {
                pageTitle: 'Ingreso',
                pageName: 'login',
                sessionUser: null,
                errors: [error]
              })
            }
          } else {
            error = 'Email y/o password no validos'
            console.log('(LOGIN.JS) *** ERROR: ' + error)
            res.render('login/login', {
              pageTitle: 'Ingreso',
              pageName: 'login',
              sessionUser: null,
              errors: [error]
            })
          }
        }).catch(function (errors) {
          console.log('(LOGIN.JS) *** ERROR: en la busqueda (login.js)' + errors)
          res.send(errors)
        })
      })*/
});

module.exports = router;