/* cSpell:disable */
/* jslint node: true */

var express = require('express');
var router = express.Router();

var db = require('../models/db');
var controlSession = require('../control/session');

var DRESSES_FOR_PAGE = 9;

/**
/ GET home page.
/ Muestra el closet o los vestidos en venta a los usuarios registrados
/ Objetivo:
/ 	Determinar la cantidad de vestidos por página y la página a mostrar:
/ 		dresses = getDresses(limit, offset) // getVestidos es una funcion parte del modelo que me devuelve los vestidos
/ 		showDresses(dresses) // showDresses es una funcion que muestra los vestidos
/ Respuesta encontrada con node: TODO JUNTO.
*/
router.get('/wishes', controlSession.isSession, function(req, res, next) {
    console.log('(DRESSES_WISHES.JS) Atendiendo la ruta /dresses/wishes GET');
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

    console.log('(DRESSES_WISHES.JS) limit: ', limit, ' page: ', page, ' offset: ', offset);
    // Esto deberia se parte del modelo o control
    db.Like.findAll({
        where: {
            userId: req.session.userLoged.id
        },
        limit: limit,
        offset: offset,
        include: {
            model: db.Dress,
            as: 'dress',
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
        }
    }).then(function(likes) { // Agui meto una funcion anonima porque nadie sabe (ni Google) como ponerla afuera, si ya sé que este codigo lo voy a utilizar de nuevo, pero a reescribir, que mas dá
        console.log('(DRESSES_WISHES.JS) ');
        var dresses = [];
        var dress;
        var i;
        for (i = 0; i < likes.length; i++) {
            dress = likes[i].dress;
            if (dress.stateId === 3) {
                dresses.push(dress);
            }
        }
        console.log('(DRESSES_WISHES.JS) dresses', dresses.length);
        for (var d in dresses) {
            if (dresses.hasOwnProperty(d)) {
                console.log('dress: ', dresses[d].id);
            }
        }

        var user = null;
        if (req.session.userLoged) {
            user = req.session.userLoged;
        }

        // Esto deberia ser parte del control, deberia ser una function, para reutilizar
        res.render('dresses/dresses_wishes', {
            title: 'Node es una mierda, y mas mierda y mas mierda',
            pageTitle: 'Vestidos',
            pageName: 'dresses_wishes',
            sessionUser: user,
            errors: null,
            dresses: dresses,
            limit: limit,
            page: page
        });
    }).catch(function(errors) { // Aqui capturo errores?????. Cuál?. Talvez un error producido en la busqueda de los vestidos
        console.log('(DRESSES_WISHES.JS) ERROR en la busqueda. ' + errors); // Aqui presento el o los errores en el terminar
        res.send('(DRESSES_WISHES.JS) ERROR en la busqueda. ' + errors); // Aqui presento el o los errores en el navegador
    });
});

router.get('/:dressId([0-9]+)/like', function(req, res, next) {
    console.log('(DRESSES_WISHES.JS) Atendiendo la ruta /dresses/:dressId/likes GET');

    var like = {};
    like.dressId = req.params.dressId;
    like.userId = req.session.userLoged.id;
    like.date = new Date();

    db.Like.create(like).then(function(like) {
        console.log('(DRESSES_WISHES.JS) Like creado.', like.id);
        res.redirect('/dresses/closet');
    }).catch(function(errors) {
        console.log('(DRESSES_WISHES.JS) ERROR ', errors);
        res.send('(DRESSES_WISHES.JS) ERROR ', errors);
    });
});

module.exports = router;