/* cSpell:disable */
/* jslint node: true */

var express = require('express');
var router = express.Router();

var db = require('../models/db');
var controlSession = require('../control/session');

router.get('/:userId([0-9]+)', controlSession.isSession, function(req, res, next) {
    console.log('(USER_VIEW.JS) Atendiendo la ruta /users/:userId GET');
    console.log('Aqui nesecito presentar los vestidos solitados. Pero con node tengo que usar sequelize. Porque no hay como separar la busqueda de la presentacion.');

    // Lo que quiero hacer:
    // Determinar el vestido a mostrar
    // user = getuser(userId) // getVestido es una funcion parte del modelo que me devuelve un vestido
    // showuser(user) // showuser es una funcion que muestra un vestido
    // Respuesta encontrada con node: TODO JUNTO.

    // Esto deberia estar aqui
    var userId = req.params.userId;
    console.log('(USER_VIEW.JS) userId: ', userId);

    if (userId) {
        // Esto deberia se parte del modelo o control
        db.User.findOne({
            where: {
                id: userId
            }
        }).then(function(user) { // Agui meto una funcion anonima porque nadie sabe (ni Google) como ponerla afuera, si ya sé que este codigo lo voy a utilizar de nuevo, pero a reescribir, que mas dá
            if (user) {
                console.log('(USER_VIEW.JS) Usuario encontrado. user: ', user.id);

                var userLoged = null;
                if (req.session.userLoged) {
                    userLoged = req.session.userLoged;
                }

                // Esto deberia ser parte del control, deberia ser una funcion, para reutilizar
                res.render('users/user_view', {
                    title: 'Node es una mierda, y mas mierda y mas mierda',
                    pageTitle: 'Vestidos',
                    pageName: 'user_view',
                    sessionUser: userLoged,
                    errors: null,
                    user: user
                });
            } else {
                console.log('(USER_VIEW.JS) ERROR no se encontró el usuario'); // Aqui presento el o los errores en el terminar
                res.send('(USER_VIEW.JS) ERROR no se encontró el usuario'); // Aqui presento el o los errores en el navegador
            }
        }).catch(function(errors) { // Aqui capturo errores?????. Cuál?. Talvez un error producido en la busqueda de los vestidos
            console.log('(USER_VIEW.JS) ERROR en la busqueda. ' + errors); // Aqui presento el o los errores en el terminar
            res.send('(USER_VIEW.JS) ERROR en la busqueda. ' + errors); // Aqui presento el o los errores en el navegador
        });
    }
});

module.exports = router;