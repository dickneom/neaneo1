/* cSpell:disable */
/* jslint node: true */

// /control/session.js

var db = require('../models/db');
var controlMessages = require('./messages');

/**
/ Verifica que el usuario esta logeado
*/
module.exports.isSession = function(req, res, next) {
    console.log('(SESSION.JS) Validando session del usuario');
    if (typeof req.session.userLoged === 'undefined') {
        console.log('(SESSION.JS) Sesion NO validada');
        res.redirect('/login');
    } else {
        console.log('(SESSION.JS)  Sesion validada. Usuario: ' + req.session.userLoged.id);
        next();
    }
};

/**
/ Verifica que el usuario esta logeado y es administrador
*/
module.exports.isAdmin = function(req, res, next) {
    console.log('(SESSION.JS) Validando si el usuario esta logueado y es administrador');

    if (typeof req.session.userLoged === 'undefined') {
        console.log('(SESSION.JS)  Usuario no logeado.');
        res.redirect('/login');
    } else {
        if (req.session.userLoged.isAdmin) {
            console.log('(SESSION.JS)  Acceso autorizado. Usuario: ' + req.session.userLoged.id);
            next();
        } else {
            console.log('(SESSION.JS)  Acceso no autorizado. Usuario: ' + req.session.userLoged.id);
            res.send('(SESSION.JS)  Acceso no autorizado. Usuario: ' + req.session.userLoged.id);
        }
    }
};

/**
/ Inicia una session
*/
module.exports.sessionInit = function sessionInit(req, res, user, rememberme) {
    console.log('(SESSION.JS) *** *** *** *** Session iniciando');
    req.session.userLoged = {
        id: user.id,
        nickname: user.nickname,
        fullname: user.fullname,
        email: user.email,
        isAdmin: user.isAdmin,
        isAuthenticated: user.authenticated
    };
    console.log('(SESSION.JS) *** *** *** *** Session iniciada');
};


/**
/ Inicia una session
*/
module.exports.login = function sessionInit(req, res, email, passEncrypt, rememberme, callback) {
    console.log('(SESSION.JS) login');
    if (email) {
        db.User.findOne({
            where: {
                email: email,
                password: passEncrypt
            }
        }).then(function(user) {
            if (user) {
                console.log('(SESSION.JS) Usuario encontrado. Creando session.');
                req.session.userLoged = {
                    id: user.id,
                    nickname: user.nickname,
                    fullname: user.fullname,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    isAuthenticated: user.authenticated,
                    messagesCount: 0
                };

                console.log('(SESSION.JS) Contando Mensajes.');
                controlMessages.messagesNewCount(user, function(errors, count) {
                    console.log('(SESSION.JS) Mensajes contados.');
                    if (errors) {
                        req.session.userLoged.messageCount = 0;
                    } else {
                        req.session.userLoged.messageCount = count;
                    }
                    console.log('(SESSION.JS) *** *** *** *** Session iniciada. Con mensajes:', req.session.userLoged.messageCount);
                    callback(null);
                });
            } else {
                error = 'Email o password incorrectos.';
                console.log('(SESSION.JS) ERROR:', error);
                callback(error);
            }
        }).catch(function(errors) {
            console.log('(SESSION.JS) ERROR en la busqueda del usuario.');
            callback(errors.errors);
        });
    } else {
        error = 'Email no definido';
        console.log('(SESSION.JS) ERROR:', error);
        callback(error);
    }
};

/**
/ Verifica si el usuario logeado esta autenticado
*/
module.exports.isAuthenticado = function isAuthenticado(req, res, next) {
    if (req.session.userLoged.isAuthenticated) {
        next(null);
    } else {
        console.log('(SESSION.JS) Usuario no autenticado.');
        var error = 'Usuario no autenticado';
        next(error);
    }
};