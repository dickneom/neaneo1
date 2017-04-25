/* cSpell:disable */
/* jslint node: true */

var db = require('../models/db');

/**
/ Metodo el usuario es el propietario del vestido o es administrador
*/
module.exports.isOwnerDress = function(req, res, next) {
    console.log('(DRESSES.JS) Validando que el usuario logeado es el propietario del vestido o si es el adiminstrador');
    var userId = req.session.userLoged.id;
    var dressId = req.params.dressId;

    // Si el usuario logeado es administrador
    console.log('(DRESSES.JS) El usuario logeado es administrador: ', req.session.userLoged.isAdmin);
    if (req.session.userLoged.isAdmin) {
        console.log('(DRESSES.JS) El usuario es administrador.');
        next();
    } else {
        // Si el usuario es el propietario del vestido
        db.Dress.findOne({
            where: {
                id: dressId
            }
        }).then(function(dress) {
            if (dress) {
                if (dress.userId === userId) {
                    console.log('(DRESSES.JS) El usuario es el propietario del vestido.');
                    next();
                } else {
                    console.log('(DRESSES.JS) ERROR No es el propietario del vestido.');
                    res.send('(DRESSES.JS) ERROR No es el propietario del vestido.');
                }
            } else {
                console.log('(DRESSES.JS) ERROR vestido no encontrado.');
                res.send('(DRESSES.JS) ERROR vestido no encontrado.');
            }
        }).catch(function(errors) {
            console.log('(DRESSES.JS) ERROR en la busqueda.');
            res.send('(DRESSES.JS) ERROR en la busqueda.');
        });
    }
};