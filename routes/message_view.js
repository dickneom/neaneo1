/* cSpell:disable */
/* jslint node: true */

var express = require('express');
var router = express.Router();

var db = require('../models/db');
var controlSession = require('../control/session');
var controlMessage = require('../control/messages');

router.get('/:messageId', controlSession.isSession, controlMessage.isOwnerMessage, function(req, res, next) {
    console.log('****** (MESSAGE_VIEW.JS) ATENDIENDO LA RUTA: ' + req.url + ' METODO: ' + req.method);

    var messageId = req.params.messageId;

    db.Message.findOne({
        where: {
            id: messageId
        },
        include: [{
            model: db.User,
            as: 'userTo'
        }, {
            model: db.User,
            as: 'userFrom'
        }]
    }).then(function(message) {
        if (message) {
            console.log('(MESSAGE_VIEW.JS) Mensaje encontrado. mostrando.');
            message.update({ isRead: true });
            res.render('messages/message_view', {
                pageTitle: 'Viendo mensaje',
                pageName: 'message_view',
                sessionUser: req.session.userLoged,
                errors: null,
                message: message
            });
        } else {
            console.log('(MESSAGE_VIEW.JS) Mensaje No encontrado. id: ', messageId);
        }
    }).catch(function(errors) {
        console.log('(MESSAGE_VIEW.JS) ERROR en la busqueda: ' + errors);
        res.send('(MESSAGE_VIEW.JS) ERROR en la busqueda: ' + errors);
    });
});

module.exports = router;