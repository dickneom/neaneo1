/* cSpell:disable */
/* jslint node: true */

var express = require('express');
var router = express.Router();

var db = require('../models/db');
var global = require('../config/global');
var controlSession = require('../control/session');
var controlUser = require('../control/users');
var controlEmail = require('../control/email');

/**
/ Metodo GET de la ruta /pass_recover
*/
router.get('/', function(req, res, next) {
    console.log('(PASS_RECOVER.JS) Atendiendo la ruta: /pass_recover GET');
    res.render('pass_recover/pass_recover', {
        pageTitle: 'Recuperar contraseña',
        pageName: 'pass_recover',
        sessionUser: null,
        errors: null
    });
});

/**
/ Metodo POST de la ruta /pass_recover
/ Este metodo recibe los datos del formulario y envia un email con un mensaje encriptado
*/
router.post('/', function(req, res, next) {
    console.log('(PASS_RECOVER.JS) Atendiendo la ruta: /pass_recover POST');
    var email = req.body.email;

    if (email && email.length > 0) {
        db.User.findOne({
            where: {
                email: email
            }
        }).then(function(user) {
            if (user) {
                console.log('(PASS_RECOVER.JS) Usuario encontrado.');
                console.log('User: ' + user.id + ' email: ' + user.email);
                var date = new Date().getTime();
                var route = user.id + ',' + date;
                console.log('(PASS_RECOVER.JS) *** MENSAJE: ' + route);
                var msgEncrypt = '/pass_recover/change/' + controlEmail.encryptEmail(route);

                var message = 'Estimado ' + user.nickname + '\n';
                message += 'Hacer click en el enlace que sigue: \n';
                message += msgEncrypt;
                message += 'Para recuperar su contraseña.';
                //
                //  SE DEBE ENVIAR UN CODIGO ESPECIAL
                //  ENVIAR EMAIL, CON UN ENLACE QUE CADUCA
                //
                controlEmail.sendSystemEmail(email, 'Recuperar Contraseña', message);
                res.render('pass_recover/pass_recover_email', {
                    pageTitle: 'Recuperar contraseña',
                    pageName: 'pass_recover_email',
                    sessionUser: null,
                    errors: null,
                    user: user,
                    tempMessage: message,
                    tempRoute: route
                });
            } else {
                console.log('(PASS_RECOVER.JS) Usuario no encontrado con el email: ' + email);
                var error = 'Email no encontrado';
                res.render('pass_recover/pass_recover', {
                    pageTitle: 'Recuperar contraseña',
                    pageName: 'pass_recover',
                    sessionUser: null,
                    errors: [error]
                });
            }
        }).catch(function(errors) {
            console.log('(PASS_RECOVER.JS) ERROR en la busqueda: ' + errors);
            res.send('(PASS_RECOVER.JS) ERROR en la busqueda: ' + errors);
        });
    } else {
        var error = 'Email no puede estar vacio';
        console.log('ERROR: ' + error);
        res.render('pass_recover/pass_recover', {
            pageTitle: 'Recuperar contraseña',
            pageName: 'pass_recover',
            sessionUser: null,
            errors: [error]
        });
    }
});

/**
/ Recibe el email enviado desde el metodo POST
*/
router.get('/change/:code', function(req, res, next) {
    console.log('(PASS_RECOVER.JS) *************** Atendiendo la ruta: /pass_recover/change/:code GET');
    var code = req.params.code;
    var error;

    if (code) {
        code = controlEmail.decryptEmail(code);
        var datos = code.split(',');
        var userId = datos[0];
        var date = new Date(parseInt(datos[1]));
        console.log('(PASS_RECOVER.JS) userId: ' + userId + ' date: ' + date);
        var dateNow = new Date();
        var dif = dateNow.getTime() - date.getTime();
        console.log('(PASS_RECOVER.JS) TRANSCURRIDO: ' + dif + ' min:' + dif / 1000 / 60);

        if (dif <= 1000 * 60 * 1) { // Cambiado para que espera una hora
            console.log('(PASS_RECOVER.JS) TRANSCURRIDO MENOS DE 15 MIN');

            db.User.findOne({
                where: {
                    id: userId
                }
            }).then(function(user) {
                if (user) {
                    console.log('(PASS_RECOVER.JS) ****** Usuario encontrado. User: ' + user.id + ' email: ' + user.email);
                    res.render('pass_recover/pass_recover_change', {
                        pageTitle: 'Recuperar contraseña',
                        pageName: 'pass_recover_change',
                        sessionUser: null,
                        errors: null,
                        userId: userId
                    });
                } else {
                    console.log('(PASS_RECOVER.JS) ****** Usuario no encontrado');
                    res.send('(PASS_RECOVER.JS) ****** Usuario no encontrado');
                }
            }).catch(function(errors) {
                console.log('(PASS_RECOVER.JS) ****** ERROR usuario no encontrado: ' + error);
                res.send('(PASS_RECOVER.JS) ****** ERROR usuario no encontrado: ' + error);
            });
        } else {
            console.log('(PASS_RECOVER.JS) TRANSCURRIDO MAS DE 15 MIN');
            error = 'En el enlace a caducado. Vuelva a intentarlo.';
            res.render('pass_recover/pass_recover', {
                pageTitle: 'Recuperar contraseña',
                pageName: 'pass_recover',
                sessionUser: null,
                errors: [error]
            });
        }
    } else {
        error = 'codigo vacio';
        console.log('ERROR: ' + error);
    }
});

/**
/ Metodo POST para la ruta /change, para el cambio de clave
*/
router.post('/change', function(req, res, next) {
    console.log('(PASS_RECOVER.JS) *************** Atendiendo la ruta: /pass_recover/change POST');
    var password = req.body.password;
    var password1 = req.body.password1;
    var userId = req.body.id;

    if (password === password1) {
        console.log('(PASS_RECOVER.JS) ****** Buscando usuario: ', userId);
        db.User.findOne({
            where: {
                id: userId
            }
        }).then(function(user) {
            if (user) {
                console.log('(PASS_RECOVER.JS) ****** Actualizando password de: ' + user.nickname);
                var pass;
                if (password && password >= global.USERS_PASS_SIZE_MIN) {
                    controlUser.encryptPassword(password, function(passEncript) {
                        pass = passEncript;
                    });
                }
                user.update({ password: pass })
                    .then(function(user) {
                        controlSession.sessionInit(req, res, user);
                        res.render('pass_recover/pass_recover_success', {
                            pageTitle: 'Recuperacion de contraseña exitosa',
                            pageName: 'pass_recover_success',
                            sessionUser: req.session.userLoged,
                            errors: null,
                            userId: userId
                        });
                    })
                    .catch(function(errors) {
                        console.log('(PASS_RECOVER.JS) al actualizar: ', error);
                        res.render('pass_recover/pass_recover_change', {
                            pageTitle: 'Recuperar contraseña',
                            pageName: 'pass_recover_change',
                            sessionUser: null,
                            errors: errors.errors,
                            userId: userId
                        });
                    });
            } else {
                console.log('(PASS_RECOVER.JS) ERROR Usuario no encontrado');
                res.send('(PASS_RECOVER.JS) ERROR Usuario no encontrado');
            }
        });
    } else { // si los password no son iguales
        var error = 'Las contraseñas no coinciden';
        console.log('(PASS_RECOVER.JS) ', error);
        res.render('pass_recover/pass_recover_change', {
            pageTitle: 'Recuperar contraseña',
            pageName: 'pass_recover_change',
            sessionUser: null,
            errors: [error],
            userId: userId
        });
    } // Fin si los password son iguales
});

module.exports = router;