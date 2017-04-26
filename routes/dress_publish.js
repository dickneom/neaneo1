/* cSpell:disable */
/* jslint node: true */

// /routes/dress_publish

var express = require('express');
var router = express.Router();

var db = require('../models/db');
var controlSession = require('../control/session');
var controlDresses = require('../control/dresses');
var controlMessages = require('../control/messages');

/**
/ Medoto GET para la ruta dresses/:idDress/publish, para publicar un vestido
*/
router.get('/:dressId([0-9]+)/publish', controlSession.isSession, controlDresses.isOwnerDress, function(req, res, next) {
    console.log('(DRESS_PUBLISH.JS) Atendiendo la ruta /dresses/:dressId/publish GET');

    var dressId = req.params.dressId;
    console.log('(DRESS_PUBLISH.JS) dressId: ', dressId);

    if (dressId) {
        // Esto deberia se parte del modelo o control
        db.Dress.findOne({
            where: {
                id: dressId
            }
        }).then(function(dress) { // Agui meto una funcion anonima porque nadie sabe (ni Google) como ponerla afuera, si ya sé que este codigo lo voy a utilizar de nuevo, pero a reescribir, que mas dá
            console.log('(DRESS_PUBLISH.JS) Vestido encontrado. dress: ', dress.id);
            dress.stateId = 2;
            dress.save().then(function(dressNew) {
                // Enviar mensaje al administrador
                console.log('(DRESS_PUBLISH.JS) Vestido publicado. dress: ', dress.id);
                var message = {};
                message.date = new Date();
                message.userIdFrom = req.session.userLoged.id;
                message.userIdTo = -1000;
                message.subject = 'Vestido publicado';
                message.text = 'Vestido publicado: id: ' + dressId + ' titulo: ' + dress.title + ' propietario: ' + dress.userId;
                message.urlTo = '/dresses/' + dressId;

                controlMessages.messageInsert(message, function(error, messNew) {
                    if (error) {
                        console.log('(DRESS_PUBLISH.JS) Mensage no enviado.');
                    } else {
                        console.log('(DRESS_PUBLISH.JS) Mensage enviado.');
                    }
                });
                res.redirect('/dresses/mycloset');
            });
        }).catch(function(errors) {
            console.log('(DRESS_PUBLISH.JS) ERROR (dress) en la busqueda. ' + errors); // Aqui presento el o los errores en el terminar
            res.send('(DRESS_PUBLISH.JS) ERROR (dress) en la busqueda. ' + errors); // Aqui presento el o los errores en el navegador
        });
    } else {
        console.log('(DRESS_PUBLISH.JS) ERROR el id del vestido no encontrado. ');
        res.send('(DRESS_PUBLISH.JS) ERROR el id del vestido no encontrado. ');
    }
});

/**
/ Medoto GET para la ruta dresses/:idDress/publish, para retirar la publicación de un vestido
*/
router.get('/:dressId([0-9]+)/publish_un', controlSession.isSession, controlDresses.isOwnerDress, function(req, res, next) {
    console.log('(DRESS_PUBLISH.JS) Atendiendo la ruta /dresses/:dressId/publish_un GET');

    var dressId = req.params.dressId;
    console.log('(DRESS_PUBLISH.JS) dressId: ', dressId);

    if (dressId) {
        // Esto deberia se parte del modelo o control
        db.Dress.findOne({
            where: {
                id: dressId
            }
        }).then(function(dress) { // Agui meto una funcion anonima porque nadie sabe (ni Google) como ponerla afuera, si ya sé que este codigo lo voy a utilizar de nuevo, pero a reescribir, que mas dá
            console.log('(DRESS_PUBLISH.JS) Vestido encontrado. dress: ', dress.id);
            dress.stateId = 1;
            dress.save().then(function(dressNew) {
                console.log('(DRESS_PUBLISH.JS) Vestido retirado. dress: ', dress.id);

                res.redirect('/dresses/mycloset');
            });
        }).catch(function(errors) {
            console.log('(DRESS_PUBLISH.JS) ERROR (dress) en la busqueda. ' + errors); // Aqui presento el o los errores en el terminar
            res.send('(DRESS_PUBLISH.JS) ERROR (dress) en la busqueda. ' + errors); // Aqui presento el o los errores en el navegador
        });
    } else {
        console.log('(DRESS_PUBLISH.JS) ERROR el id del vestido no encontrado. ');
        res.send('(DRESS_PUBLISH.JS) ERROR el id del vestido no encontrado. ');
    }
});

/**
/ Medoto GET para la ruta dresses/:idDress/publish_acept, para aceptar la publicacion de un vestido
*/
router.get('/:dressId([0-9]+)/publish_acept', controlSession.isAdmin, function(req, res, next) {
    console.log('(DRESS_PUBLISH.JS) Atendiendo la ruta /dresses/:dressId/publish_acept GET');

    var dressId = req.params.dressId;
    console.log('(DRESS_PUBLISH.JS) dressId: ', dressId);

    if (dressId) {
        // Esto deberia se parte del modelo o control
        db.Dress.findOne({
            where: {
                id: dressId
            }
        }).then(function(dress) { // Agui meto una funcion anonima porque nadie sabe (ni Google) como ponerla afuera, si ya sé que este codigo lo voy a utilizar de nuevo, pero a reescribir, que mas dá
            console.log('(DRESS_PUBLISH.JS) Vestido encontrado. dress: ', dress.id);
            dress.stateId = 3;
            dress.save().then(function(dressNew) {
                // Enviar mensaje al administrador
                console.log('(DRESS_PUBLISH.JS) Vestido aceptado para publicacion. dress: ', dress.id);
                var message = {};
                message.date = new Date();
                message.userIdFrom = -1000;
                message.userIdTo = req.session.userLoged.id;
                message.subject = 'Vestido aprobado';
                message.text = 'Vestido aprobado: id: ' + dressId + ' titulo: ' + dress.title + ' propietario: ' + dress.userId;
                message.urlTo = '/dresses/' + dressId;

                controlMessages.messageInsert(message, function(error, messNew) {
                    if (error) {
                        console.log('(DRESS_PUBLISH.JS) Mensage no enviado.');
                    } else {
                        console.log('(DRESS_PUBLISH.JS) Mensage enviado.');
                    }
                });
                res.redirect('/messages');
            });
        }).catch(function(errors) {
            console.log('(DRESS_PUBLISH.JS) ERROR (dress) en la busqueda. ' + errors); // Aqui presento el o los errores en el terminar
            res.send('(DRESS_PUBLISH.JS) ERROR (dress) en la busqueda. ' + errors); // Aqui presento el o los errores en el navegador
        });
    } else {
        console.log('(DRESS_PUBLISH.JS) ERROR el id del vestido no encontrado. ');
        res.send('(DRESS_PUBLISH.JS) ERROR el id del vestido no encontrado. ');
    }
});

/**
/ Medoto GET para la ruta dresses/:idDress/publish_acept, para aceptar la publicacion de un vestido
*/
router.get('/:dressId([0-9]+)/publish_reject', controlSession.isAdmin, function(req, res, next) {
    console.log('(DRESS_PUBLISH.JS) Atendiendo la ruta /dresses/:dressId/publish_reject GET');

    var dressId = req.params.dressId;
    console.log('(DRESS_PUBLISH.JS) dressId: ', dressId);

    if (dressId) {
        // Esto deberia se parte del modelo o control
        db.Dress.findOne({
            where: {
                id: dressId
            }
        }).then(function(dress) { // Agui meto una funcion anonima porque nadie sabe (ni Google) como ponerla afuera, si ya sé que este codigo lo voy a utilizar de nuevo, pero a reescribir, que mas dá
            console.log('(DRESS_PUBLISH.JS) Vestido encontrado. dress: ', dress.id);
            dress.stateId = 1;
            dress.save().then(function(dressNew) {
                // Enviar mensaje al administrador
                console.log('(DRESS_PUBLISH.JS) Vestido NO aceptado para publicacion. dress: ', dress.id);
                var message = {};
                message.date = new Date();
                message.userIdFrom = -1000;
                message.userIdTo = req.session.userLoged.id;
                message.subject = 'Vestido no aprobado';
                message.text = 'Vestido no aprobado: id: ' + dressId + ' titulo: ' + dress.title + ' propietario: ' + dress.userId;
                message.urlTo = '/dresses/' + dressId;

                controlMessages.messageInsert(message, function(error, messNew) {
                    if (error) {
                        console.log('(DRESS_PUBLISH.JS) Mensage no enviado.');
                    } else {
                        console.log('(DRESS_PUBLISH.JS) Mensage enviado.');
                    }
                });
                res.redirect('/messages');
            });
        }).catch(function(errors) {
            console.log('(DRESS_PUBLISH.JS) ERROR (dress) en la busqueda. ' + errors); // Aqui presento el o los errores en el terminar
            res.send('(DRESS_PUBLISH.JS) ERROR (dress) en la busqueda. ' + errors); // Aqui presento el o los errores en el navegador
        });
    } else {
        console.log('(DRESS_PUBLISH.JS) ERROR el id del vestido no encontrado. ');
        res.send('(DRESS_PUBLISH.JS) ERROR el id del vestido no encontrado. ');
    }
});

module.exports = router;