/* cSpell:disable */
/* jslint node: true */

var express = require('express');
var router = express.Router();

var db = require('../models/db');
var controlSession = require('../control/session');

router.get('/:userId([0-9]+)/update', controlSession.isSession, function(req, res, next) {
    console.log('(USER_UPDATE.JS) Atendiendo la ruta /users/:userId/update GET');
    console.log('Aqui nesecito presentar el usuario a editar. Pero con node tengo que usar sequelize. Porque no hay como separar la busqueda de la presentacion.');

    // Lo que quiero hacer:
    // Determinar el usuario a mostrar
    // user = getuser(userId) // getusuario es una funcion parte del modelo que me devuelve un usuario
    // showuser(user) // showuser es una funcion que muestra un usuario
    // Respuesta encontrada con node: TODO JUNTO.

    // Esto deberia estar aqui
    var userId = req.params.userId;
    console.log('(USER_UPDATE.JS) userId: ', userId);

    if (userId) {
        // Esto deberia se parte del modelo o control
        db.User.findOne({
            where: {
                id: userId
            }
        }).then(function(user) { // Agui meto una funcion anonima porque nadie sabe (ni Google) como ponerla afuera, si ya sé que este codigo lo voy a utilizar de nuevo, pero a reescribir, que mas dá
            // var date = user.birthdate.getDate()
            console.log('(USER_UPDATE.JS) usuario encontrado. user: ', user.id, ' CUMPLEAÑOS: ', user.birthdate);

            // Esto deberia ser parte del control, deberia ser una funcion, para reutilizar
            res.render('users/user_update', {
                title: 'Node es una mierda, y mas mierda y mas mierda',
                pageTitle: 'Usuarios',
                pageName: 'user_update',
                sessionUser: req.session.userLoged,
                errors: null,
                user: user
            });
        }).catch(function(errors) { // Aqui capturo errores?????. Cuál?. Talvez un error producido en la busqueda de los usuarios
            console.log('(USER_UPDATE.JS) ERROR en la busqueda. ' + errors); // Aqui presento el o los errores en el terminar
            res.send('(USER_UPDATE.JS) ERROR en la busqueda. ' + errors); // Aqui presento el o los errores en el navegador
        });
    }
});

router.post('/update', controlSession.isSession, function(req, res, next) {
    console.log('(USER_UPDATE.JS) Atendiendo la ruta /users/update POST');
    console.log('Aqui nesecito mostrar un formulario vacio o lleno con los datos de un usuario ingresados. Pero con node tengo que usar sequelize. Porque no hay como separar la busqueda de la presentacion.');

    var userId = req.body.userId;

    if (userId) {
        db.User.findOne({
            where: {
                id: userId
            }
        }).then(function(user) {
            user.nickname = req.body.nickname;
            user.firstname = req.body.firstname;
            user.lastname = req.body.lastname;
            user.email = req.body.email;
            user.birthdate = req.body.birthdate;
            console.log('CUMPLEAÑOS ', user.birthdate, '-***********************', req.body.birthdate);

            user.save().then(function(userNew) {
                res.render('users/user_update', {
                    title: 'Node es una mierda, y mas mierda y mas mierda',
                    pageTitle: 'Usuarios',
                    pageName: 'user_update',
                    sessionUser: req.session.userLoged,
                    errors: null,
                    user: userNew
                });
            }).catch(function(errors) {
                res.render('users/user_update', {
                    title: 'Node es una mierda, y mas mierda y mas mierda',
                    pageTitle: 'Usuarios',
                    pageName: 'user_update',
                    sessionUser: null,
                    errors: errors,
                    user: user
                });
            });
        }).catch(function(errors) {
            console.log('(USER_UPDATE.JS) ERROR en la busqueda. ' + errors);
            res.send('(USER_UPDATE.JS) ERROR en la busqueda. ' + errors);
        });
    } else {
        console.log('(USER_UPDATE.JS) ERROR el id del usuario no encontrado. ');
        res.send('(USER_UPDATE.JS) ERROR el id del usuario no encontrado. ');
    }
});

module.exports = router;