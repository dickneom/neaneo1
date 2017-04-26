/* cSpell:disable */
/* jslint node: true */

var express = require('express');
var router = express.Router();

var db = require('../models/db');
var controlUser = require('../control/users');
var controlEmail = require('../control/email');
var controlSession = require('../control/session');

var PASS_SIZE_MIN = 6;
var IMAG_USER_ANON = 'http://res.cloudinary.com/cloud-dc/image/upload/v1487441736/brwltuenzajetyxciozo.png';

/**
/ Metodo GET para la ruta /register, para el registro de un usuario
*/
router.get('/', function(req, res, next) {
    console.log('(REGISTER.JS) Atendiendo la ruta: /register GET');
    res.render('register/register', {
        pageTitle: 'Registro',
        pageName: 'register',
        sessionUser: null,
        errors: null
    });
});

/**
/ Metodo POST para la ruta /register, para el registro de un usuario
*/
router.post('/', function(req, res, next) {
    console.log('(REGISTER.JS) Atendiendo la ruta: /register POST');

    var user = {};
    user.id = req.body.id;
    user.nickname = req.body.nickname;
    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;
    user.email = req.body.email;
    user.birthdate = req.body.birthdate;
    user.password = req.body.password;
    user.picture = IMAG_USER_ANON;

    var pass = req.body.password1;
    var clavesIguales = true;
    if (pass !== user.password) {
        user.password = '';
        clavesIguales = false;
    } else {
        console.log('(REGISTER.JS) password ', user.password);
        if (user.password && user.password.length >= PASS_SIZE_MIN) {
            controlUser.encryptPassword(user.password, function(resultado) {
                user.password = resultado;
                console.log('(REGISTER.JS) password encriptado 1 ', user.password);
            });
            console.log('(REGISTER.JS) password encriptado 2 ', user.password);
        }
    }

    console.log('(REGISTER.JS) *** Registrar usuario: ' + user);
    db.User.create(user)
        .then(function(userNew) {
            console.log('(REGISTER.JS) ****** Registro creado correctamente!');
            // Armando al mensaje que se va a enviar al email
            var date = new Date().getTime();
            var route = userNew.id + ',' + date;
            console.log('(REGISTER.JS) ********* Ruta a enviar: ' + route);
            route = '/register/' + controlEmail.encryptEmail(route);

            var message = 'Estimado ' + userNew.nickname + '\n';
            message += 'Hacer click en el enlace que sigue: \n';
            message += route;
            message += 'Para confirmar su email';

            controlEmail.sendSystemEmail(userNew.email, 'Confimacion email', message);
            //
            // ENVIAR EMAIL
            // EN MENSAJE CONTIENE LOS DATOS: ID DEL USUARIO, FECHA Y HORA DE ENVIO
            // EL MENSAJE DEBE IR ENCRIPTADO
            //
            res.render('register/register_success', {
                pageTitle: 'Registro',
                pageName: 'register_success',
                sessionUser: null,
                errors: null,
                user: userNew,
                tempMessage: message, // Este mensaje debe enviarse por email
                tempRoute: route // Esta ruta se incluye en el email
            });
        })
        .catch(function(errors) {
            console.log('(REGISTER.JS) ****** ERROR. No se registraron los datos! : ' + errors);
            var es = errors.errors;
            for (var i = 0; i < es.length; i++) {
                var error = es[i];
                if (error.path === 'password' && !clavesIguales) {
                    console.log('(REGISTER.JS) ****** ERROR. Cambiando error de claves por no son iguales.');
                    es[i].message = 'Las contraseñas no son iguales';
                }
                console.log('********* Error ' + i + ' path: ' + error.path + ' error ' + error.message);
            }
            res.render('register/register', {
                pageTitle: 'Registro',
                pageName: 'register',
                sessionUser: null,
                user: user,
                errors: errors.errors
            });
        });
});

/**
/ Verificar el email del usuario.
/ Esta ruta es unviada desde el metodo POST de la ruta /register por email al usuario para que verifique el email
*/
router.get('/:verif', function(req, res) {
    console.log('*************** Atendiendo la ruta: /register/:verif GET');
    var code = req.params.verif;

    if (code) {
        code = controlEmail.decryptEmail(code);
        var datos = code.split(',');
        var userId = datos[0];
        var date = new Date(parseInt(datos[1]));
        console.log('*** userId: ' + userId + ' date: ' + date);
        var dateNow = new Date();
        var dif = dateNow.getTime() - date.getTime();
        if (dif <= 1000 * 60 * 60) { // Cambiado a 60 MINUTOS
            console.log('(REGISTER.JS) ****** TRANSCURRIDO MENOS DE 15 MIN');
            db.User.findOne({
                where: {
                    id: userId
                }
            }).then(function(user) {
                if (user) {
                    console.log('(REGISTER.JS) ********* Autenticando: ' + user.nickname);
                    user.update({ authenticated: true })
                        .then(function(userNew) {
                            console.log('(REGISTER.JS) ********* Actualizado: ' + userNew.id);
                            controlSession.sessionInit(req, res, userNew);
                            res.render('register/register_verified', {
                                pageTitle: 'Registro Verificado',
                                pageName: 'register_verified',
                                sessionUser: userNew,
                                errors: null
                            });
                        })
                        .catch(function(errors) {
                            console.log('(REGISTER.JS) ****** ERROR en la actualizacion del usuario');
                            res.render('error', errors);
                        });
                } else {
                    console.log('(REGISTER.JS) ****** ERROR usuario no encontrado');
                    // HACER ALGO SI NO SE ENCUENTRA
                } // fin verificar si se encontro el usuario
            }).catch(function(errors) {
                console.log('(REGISTER.JS) ****** ERROR en la busqueda el usuario: ' + errors);
                res.render('error', errors);
            });
        } else {
            console.log('(REGISTER.JS) ****** TRANSCURRIDO MAS DE 15 MIN. EMAIL CADUCADO');
            //
            //  SE DEBE HACER ALGO CUANDO CADUCA EL MENSAJE
            //
            res.send('(REGISTER.JS) ****** TRANSCURRIDO MAS DE 15 MIN. EMAIL CADUCADO');
        } // fin verifica caducidad
    } else {
        console.log('(REGISTER.JS) ERROR. Ruta sin codigo de verificacion.');
    } // fin if (code)
});

module.exports = router;