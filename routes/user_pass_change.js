/* cSpell:disable */
/* jslint node: true */

var express = require('express');
var router = express.Router();

var db = require('../models/db');
var controlSession = require('../control/session');
var controlUser = require('../control/users');

router.get('/pass_change', controlSession.isSession, function(req, res, next) {
    res.render('users/user_pass_change', {
        pageTitle: 'Cambio de contraseña',
        pageName: 'user_pass_change',
        sessionUser: req.session.userLoged,
        errors: null
    });
});

router.post('/pass_change', controlSession.isSession, function(req, res, next) {
    console.log('(USER_PASS_CHANGE.JS) Atendiendo la ruta /users/pass_change POST');
    var userId = req.session.userLoged.id;
    var passOld = req.body.passOld;

    var pass1 = req.body.pass1;
    var pass2 = req.body.pass2;
    if (pass1 === pass2) {
        console.log('(USER_PASS_CHANGE.JS) Contraseñas Iguales');
        console.log('(USER_PASS_CHANGE.JS) Encriptanco contraseña anterior');
        controlUser.encryptPassword(passOld, function(passEncrypt) {
            console.log('(USER_PASS_CHANGE.JS) Contraseña anterior encriptada');
            var error;

            db.User.findOne({
                where: {
                    id: userId,
                    password: passEncrypt
                }
            }).then(function(user) {
                if (user) {
                    console.log('(USER_PASS_CHANGE.JS) Usuario con Contraseña anterior encontrado');
                    console.log('(USER_PASS_CHANGE.JS) Encriptando contraseña actual');
                    controlUser.encryptPassword(pass1, function(pass1Encrypt) {
                        console.log('(USER_PASS_CHANGE.JS) Contraseña actual encriptada');
                        user.update({ password: pass1Encrypt }).then(function(user) {
                            console.log('(USER_PASS_CHANGE.JS) Contraseña actual cambiada');
                            res.redirect('/users/profile');
                            // res.send('Contraseña cambiada correctamente!')
                        }).catch(function(errors) {
                            res.render('users/user_pass_change', {
                                pageTitle: 'Cambio de contraseña',
                                pageName: 'user_pass_change',
                                sessionUser: req.session.userLoged,
                                errors: errors.errors
                            });
                        });
                    });
                } else {
                    console.log('(USER_PASS_CHANGE.JS) Usuario con Contraseña anterior NO encontrado');
                    error = 'Contraseña incorrecta.';
                    res.render('users/user_pass_change', {
                        pageTitle: 'Cambio de contraseña',
                        pageName: 'user_pass_change',
                        sessionUser: req.session.userLoged,
                        errors: [error]
                    });
                }
            }).catch(function(errors) {
                console.log('(USER_PASS_CHANGE.JS) Error en la busqueda el usuario.');
                res.send('(USER_PASS_CHANGE.JS) Error en la busqueda el usuario.');
            });
        });
    } else {
        var error = 'Las contraseñas no coinciden.';
        res.render('users/user_pass_change', {
            pageTitle: 'Cambio de contraseña',
            pageName: 'user_pass_change',
            sessionUser: req.session.userLoged,
            errors: [error]
        });
    }
});

module.exports = router;