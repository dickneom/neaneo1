/* cSpell:disable */
/* jslint node: true */

var express = require('express');
var router = express.Router();

var db = require('../models/db');

router.get('/:dressId([0-9]+)', function(req, res, next) {
    console.log('(INDEX.JS) Atendiendo la ruta /dresses/:dressId GET');
    console.log('Aqui nesecito presentar los vestidos solitados. Pero con node tengo que usar sequelize. Porque no hay como separar la busqueda de la presentacion.');

    // Lo que quiero hacer:
    // Determinar el vestido a mostrar
    // dress = getDress(dressId) // getVestido es una funcion parte del modelo que me devuelve un vestido
    // showDress(dress) // showDress es una funcion que muestra un vestido
    // Respuesta encontrada con node: TODO JUNTO.

    // Esto deberia estar aqui
    var dressId = req.params.dressId;
    console.log('(DRESS_VIEW.JS) dressId: ', dressId);

    if (dressId) {
        // Esto deberia se parte del modelo o control
        db.Dress.findOne({
            where: {
                id: dressId
            },
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
            }, {
                model: db.Photo,
                as: 'photos'
            }]
        }).then(function(dress) { // Agui meto una funcion anonima porque nadie sabe (ni Google) como ponerla afuera, si ya sé que este codigo lo voy a utilizar de nuevo, pero a reescribir, que mas dá
            console.log('(DRESS_VIEW.JS) Vestido encontrado. dress: ', dress.id);


            console.log('(DRESS_VIEW.JS) Vestido encontrado. dress: ', dress.image);
            for (var i = 0; i < dress.photos.length; i++) {
                console.log('(DRESS_VIEW.JS) Vestido encontrado. dress: ', dress.photos[i].photo_url);
            }


            var user = null;
            if (req.session.userLoged) {
                user = req.session.userLoged;
            }
            console.log('vestido se renta: ', dress.forRent, ' Se vende: ', dress.forSale);
            // Esto deberia ser parte del control, deberia ser una funcion, para reutilizar
            res.render('dresses/dress_view', {
                title: 'Node es una mierda, y mas mierda y mas mierda',
                pageTitle: 'Vestidos',
                pageName: 'dress_view',
                sessionUser: user,
                errors: null,
                dress: dress
            });
        }).catch(function(errors) { // Aqui capturo errores?????. Cuál?. Talvez un error producido en la busqueda de los vestidos
            console.log('(DRESS_VIEW.JS) ERROR en la busqueda. ' + errors); // Aqui presento el o los errores en el terminar
            res.send('(DRESS_VIEW.JS) ERROR en la busqueda. ' + errors); // Aqui presento el o los errores en el navegador
        });
    }
});

module.exports = router;