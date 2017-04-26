/* cSpell:disable */
/* jslint node: true */

var express = require('express');
var router = express.Router();

var db = require('../models/db');
var controlSession = require('../control/session');
// var controlDresses = require('../control/dresses')
// var controlMessages = require('../control/messages')

// liseta de mensajes para el propietario, si el usuario es administrador tambien se agregan los del administrador
router.get('/', controlSession.isSession, function(req, res, next) {
    console.log('****** (MESSAGES.JS) ATENDIENDO LA RUTA: ' + req.url + ' METODO: ' + req.method);

    var where;
    if (req.session.userLoged.isAdmin) {
        where = {
            userIdTo: [req.session.userLoged.id, -1000]
        };
    } else {
        where = {
            userIdTo: req.session.userLoged.id
        };
    }

    db.Message.findAll(where).then(function(messages) {
        console.log('(MESSAGES.JS) Mensajes buscados con exito');
        res.render('messages/messages', {
            pageTitle: 'Mensajes',
            pageName: 'messages',
            sessionUser: req.session.userLoged,
            errors: null,
            messages: messages
        });
    }).catch(function(errors) {
        res.send('(MESSAGES.JS) ERROR en la busqueda: ' + errors);
    });
});

module.exports = router;