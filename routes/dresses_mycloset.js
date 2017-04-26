/* cSpell:disable */
/* jslint node: true */

// /routes/dress_mycloset.js

var express = require('express');
var router = express.Router();

var db = require('../models/db');
var controlSession = require('../control/session');

var DRESSES_FOR_PAGE = 9;

/**
/ GET home page.
/ muestra el closet de una persona (propietario)
/ Objetivo:
/ 	Determinar la cantidad de vestidos por página y la página a mostrar:
/ 		dresses = getDresses(limit, offset) // getVestidos es una funcion parte del modelo que me devuelve los vestidos
/ 		showDresses(dresses) // showDresses es una funcion que muestra los vestidos
/ Respuesta encontrada con node: TODO JUNTO.
*/
router.get('/mycloset', controlSession.isSession, function(req, res, next) {
    console.log('(DRESSES_MYCLOSET.JS) Atendiendo la ruta /dresses/mycloset GET');
    console.log('Aqui nesecito presentar los vestidos solitados. Pero con node tengo que usar sequelize. Porque no hay como separar la busqueda de la presentacion.');

    //  Lo que quiero hacer:
    //  Determinar la cantidad de vestidos por página y la página a mostrar
    //  dresses = getDresses(limit, offset) // getVestidos es una funcion parte del modelo que me devuelve los vestidos
    //  showDresses(dresses) // showDresses es una funcion que muestra los vestidos
    //  Respuesta encontrada con node: TODO JUNTO.

    // Esto deberia estar aqui
    var limit = req.query.limit;
    var page = req.query.page;
    var offset;

    if (!limit) { // Que verifico aquí  ??????????? Nadie lo sabe, o por lo menos Google no lo sabe
        limit = DRESSES_FOR_PAGE; // Esto no es usa en node, habria que poner el 9
    }
    if (!page) { // Que verifico aquí  ??????????? Nadie lo sabe, o por lo menos Google no lo sabe
        page = 1;
    }

    // ahora hay que decirle a node que limit y page son numeros
    limit = parseInt(limit, 10);
    page = parseInt(page, 10);
    if (page < 1) {
        page = 1;
    }
    offset = limit * (page - 1);

    console.log('(DRESSES_MYCLOSET.JS) limit: ', limit, ' page: ', page, ' offset: ', offset);
    // Esto deberia se parte del modelo o control
    db.Dress.findAll({
        where: {
            userId: req.session.userLoged.id
        },
        limit: limit,
        offset: offset,
        include: [{
            model: db.User,
            as: 'user'
        }, {
            model: db.Color,
            as: 'color'
        }, {
            model: db.Brand,
            as: 'brand'
        }, {
            model: db.State,
            as: 'state'
        }]
    }).then(function(dresses) { // Agui meto una funcion anonima porque nadie sabe (ni Google) como ponerla afuera, si ya sé que este codigo lo voy a utilizar de nuevo, pero a reescribir, que mas dá
        console.log('(DRESSES_MYCLOSET.JS) dresses', dresses.length);
        for (var dress in dresses) {
            if (dresses.hasOwnProperty(dress)) {
                console.log('dress: ', dresses[dress].id);
            }
        }

        var user = null;
        if (req.session.userLoged) {
            user = req.session.userLoged;
        }

        // Esto deberia ser parte del control, deberia ser una function, para reutilizar
        res.render('dresses/dresses_mycloset', {
            title: 'Node es una mierda, y mas mierda y mas mierda',
            pageTitle: 'Mi Closet',
            pageName: 'dresses_mycloset',
            sessionUser: user,
            errors: null,
            dresses: dresses,
            limit: limit,
            page: page
        });
    }).catch(function(errors) { // Aqui capturo errores?????. Cuál?. Talvez un error producido en la busqueda de los vestidos
        console.log('(DRESSES_MYCLOSET.JS) ERROR en la busqueda. ' + errors); // Aqui presento el o los errores en el terminar
        res.send('(DRESSES_MYCLOSET.JS) ERROR en la busqueda. ' + errors); // Aqui presento el o los errores en el navegador
    });
});

module.exports = router;