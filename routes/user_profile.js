/* cSpell:disable */
/* jslint node: true */

// /routes/users_profile

var express = require('express');
var router = express.Router();

var db = require('../models/db');
var controlSession = require('../control/session');

router.get('/profile', controlSession.isSession, function(req, res, next) {
    console.log('(USERS_PROFILE.JS) Atendiendo la ruta /users/profile GET');

    var userId = req.session.userLoged.id;

    db.User.findOne({
        where: {
            id: userId
        }
    }).then(function(user) {
        if (user) {
            console.log('(USER_PROFILE.JS) Usuario encontrado. user: ', user.id);

            // Esto deberia ser parte del control, deberia ser una funcion, para reutilizar
            res.render('users/user_profile', {
                title: 'Node es una mierda, y mas mierda y mas mierda',
                pageTitle: 'Vestidos',
                pageName: 'user_profile',
                sessionUser: req.session.userLoged,
                errors: null,
                user: user
            });
        } else {
            console.log('(USER_PROFILE.JS) ERROR no se encontró el usuario.'); // Aqui presento el o los errores en el terminar
            res.send('(USER_PROFILE.JS) ERROR no se encontró el usuario.'); // Aqui presento el o los errores en el navegador
        }
    }).catch(function(errors) { // Aqui capturo errores?????. Cuál?. Talvez un error producido en la busqueda de los vestidos
        console.log('(USER_PROFILE.JS) ERROR en la busqueda. ' + errors); // Aqui presento el o los errores en el terminar
        res.send('(USER_PROFILE.JS) ERROR en la busqueda. ' + errors); // Aqui presento el o los errores en el navegador
    });
});

module.exports = router;