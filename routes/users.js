/* cSpell:disable */
/* jslint node: true */

var express = require('express');
var router = express.Router();

var db = require('../models/db');

var USERS_FOR_PAGE = 9;

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log('(INDEX.JS) Atendiendo la ruta /users GET');
    console.log('Aqui nesecito presentar los usuarios solitados. Pero con node tengo que usar sequelize. Porque no hay como separar la busqueda de la presentacion.');

    //  Lo que quiero hacer:
    //  Determinar la cantidad de usuarios por página y la página a mostrar
    //  users = getUsers(limit, offset) // getusuarios es una funcion parte del modelo que me devuelve los usuarios
    //  showUsers(users) // showusers es una funcion que muestra los usuarios
    //  Respuesta encontrada con node: TODO JUNTO.

    // Esto deberia estar aqui
    var limit = req.query.limit;
    var page = req.query.page;
    var offset;

    if (!limit) { // Que verifico aquí  ??????????? Nadie lo sabe, o por lo menos Google no lo sabe
        limit = USERS_FOR_PAGE; // Esto no es usa en node, habria que poner el 9
    }
    if (!page) { // Que verifico aquí  ??????????? Nadie lo sabe, o por lo menos Google no lo sabe
        page = 1;
    }

    // ahora hay que decirle a node que limit y page son numeros
    limit = parseInt(limit, 10);
    page = parseInt(page, 10);
    offset = limit * (page - 1);

    console.log('(USERS.JS) limit: ', limit, ' page: ', page, ' offset: ', offset);
    // Esto deberia se parte del modelo o control
    db.User.findAll({
        limit: limit,
        offset: offset
    }).then(function(users) { // Agui meto una funcion anonima porque nadie sabe (ni Google) como ponerla afuera, si ya sé que este codigo lo voy a utilizar de nuevo, pero a reescribir, que mas dá
        // console.log('(USERS.JS) users', users);
        for (var user in users) {
            if (users.hasOwnProperty(user)) {
                console.log('user: ', users[user].id, users[user].name);
            }
        }

        // Esto deberia ser parte del control, deberia ser una function, para reutilizar
        res.render('users/users', {
            title: 'Node es una mierda, y mas mierda y mas mierda',
            pageTitle: 'usuarios',
            pageName: 'users',
            sessionUser: null,
            errors: null,
            users: users
        });
    }).catch(function(errors) { // Aqui capturo errores?????. Cuál?. Talvez un error producido en la busqueda de los usuarios
        console.log('(USERS.JS) ERROR en la busqueda. ' + errors); // Aqui presento el o los errores en el terminar
        res.send('(USERS.JS) ERROR en la busqueda. ' + errors); // Aqui presento el o los errores en el navegador
    });
});

module.exports = router;