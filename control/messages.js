/* cSpell:disable */
/* jslint node: true */

// /control/messages.js

var db = require('../models/db');

module.exports.messageInsert = function messageInsert(mess, cb) {
    db.Message.create(mess).then(function(message) {
        cb(null, message);
    }).catch(function(errors) {
        cb(errors);
    });
};

/**
/ Metodo el usuario es el propietario o va dirigido el mensaje  o es administrador
*/
module.exports.isOwnerMessage = function(req, res, next) {
    console.log('(MESSAGES.JS) Validando que el usuario logeado esta relacionado con el mensaje o si es el adiminstrador');
    var userId = req.session.userLoged.id;
    var messageId = req.params.messageId;

    // Si el usuario logeado es administrador
    console.log('(MESSAGES.JS) El usuario logeado es administrador: ', req.session.userLoged.isAdmin);
    if (req.session.userLoged.isAdmin) {
        console.log('(MESSAGES.JS) El usuario es administrador.');
        next();
    } else {
        // Si el usuario es el propietario del vestido
        db.Dress.findOne({
            where: {
                id: dressId
            }
        }).then(function(message) {
            if (dress) {
                if (message.userIdFrom === userId || message.userIdTo === userId) {
                    console.log('(MESSAGES.JS) El usuario esta relacionado con el mensaje.');
                    next();
                } else {
                    console.log('(MESSAGES.JS) ERROR El usuario no esta relacionado con el mensaje.');
                    res.send('(MESSAGES.JS) ERROR El usuario no esta relacionado con el mensaje.');
                }
            } else {
                console.log('(MESSAGES.JS) ERROR mensaje no encontrado.');
                res.send('(MESSAGES.JS) ERROR mensaje no encontrado.');
            }
        }).catch(function(errors) {
            console.log('(MESSAGES.JS) ERROR en la busqueda.');
            res.send('(MESSAGES.JS) ERROR en la busqueda.');
        });
    }
};

module.exports.messagesNewCount = function messagesNewCount(user, callback) {
    console.log('(MESSAGES.JS) messageNewCount');
    var where;
    if (user.isAdmin) {
        where = {
            userIdTo: [user.id, -1000],
            isRead: false
        };
    } else {
        where = {
            userIdTo: user.id,
            isRead: false
        };
    }

    console.log('(MESSAGES.JS) listo para contar mensajes.', where);
    db.Message.count(where).then(function(count) {
        console.log('(MESSAGES.JS) Encontrados', count, 'mensajes.');
        callback(null, count);
    }).catch(function(errors) {
        console.log('(MESSAGES.JS) ERROR al buscar los mensajes.');
        callback(errors);
    });
};