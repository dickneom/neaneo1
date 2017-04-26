/* cSpell:disable */
/* jslint node: true */

var express = require('express');
var router = express.Router();

var db = require('../models/db');
var controlSession = require('../control/session');
var controlDresses = require('../control/dresses');

/**
/ Medoto GET para la ruta dresses/:idDress/update, para actualizar la informacion de un vestido
*/
router.get('/:dressId([0-9]+)/update', controlSession.isSession, controlDresses.isOwnerDress, function(req, res, next) {
    console.log('(DRESS_UPDATE.JS) Atendiendo la ruta /dresses/:dressId/update GET');
    console.log('Aqui nesecito presentar el vestido a editar. Pero con node tengo que usar sequelize. Porque no hay como separar la busqueda de la presentacion.');

    // Lo que quiero hacer:
    // Determinar el vestido a mostrar
    // dress = getDress(dressId) // getVestido es una funcion parte del modelo que me devuelve un vestido
    // showDress(dress) // showDress es una funcion que muestra un vestido
    // Respuesta encontrada con node: TODO JUNTO.

    // Esto deberia estar aqui
    var dressId = req.params.dressId;
    console.log('(DRESS_UPDATE.JS) dressId: ', dressId);

    if (dressId) {
        // Esto deberia se parte del modelo o control
        db.Dress.findOne({
            where: {
                id: dressId
            }
        }).then(function(dress) { // Agui meto una funcion anonima porque nadie sabe (ni Google) como ponerla afuera, si ya sé que este codigo lo voy a utilizar de nuevo, pero a reescribir, que mas dá
            console.log('(DRESS_UPDATE.JS) Vestido encontrado. dress: ', dress.id);

            // Determinar si el vestido puede ser editado
            if (dress.stateId <= 3) { // Estados 1=REGISTRADO, 2= PUBLICADO, 3= APROBADO
                // Determinar el usuario logeado, null si no esta logeado
                var userLoged = null;
                if (req.session.userLoged) {
                    userLoged = req.session.userLoged;
                }

                // Recuperando los colores disponibles
                console.log('(DRESS_UPDATE.JS) Recuperando colores');
                // var colors
                db.Color.findAll().then(function(colors) {
                    if (colors) {
                        // console.log('(DRESS_UPDATE.JS) Encontrados: ', cls.length, ' colores.')
                        // colors = cls
                        console.log('(DRESS_UPDATE.JS) Encontrados: ', colors.length, ' colores.');
                        // Tipico en node amontona todo aqui. Averigua donde quedara el catch para este findAll.
                        // Si no lo haces, el render lo hara con colors: undefined? null? o ???
                        // Recuperando las marcar disponibles
                        console.log('(DRESS_UPDATE.JS) Recuperando marcas');
                        // var brands
                        db.Brand.findAll().then(function(brands) {
                            if (brands) {
                                // console.log('(DRESS_UPDATE.JS) Encontrados: ', brs.length, ' marcas.')
                                // brands = brs
                                console.log('(DRESS_UPDATE.JS) Encontrados: ', brands.length, ' marcas.');
                                // Sigue amontonando, cuando te pierdas, desechas el codigo y vuelves a amontonar. Averigua donde quedara el catch para este findAll.
                                // Si no lo haces, el render lo hara con colors: undefined? null? o ???
                                // Recuperando las marcar disponibles
                                console.log('vestido se renta: ', dress.forRent, ' Se vende: ', dress.forSale);
                                // Esto deberia ser parte del control, deberia ser una funcion, para reutilizar
                                console.log('(DRESS_UPDATE.JS) Mostrando vestido para edicion.');
                                res.render('dresses/dress_update', {
                                    title: 'Node es una mierda, y mas mierda y mas mierda',
                                    pageTitle: 'Vestidos',
                                    pageName: 'dress_update',
                                    sessionUser: userLoged,
                                    errors: null,
                                    dress: dress,
                                    brands: brands,
                                    colors: colors
                                });
                            } else { // if para las marcas
                                console.log('(DRESS_UPDATE.JS) ERROR no se encontró ninguna marca.');
                            }
                        }).catch(function(errors) {
                            console.log('(DRESS_UPDATE.JS) ERROR en la busqueda al recuperar las marcas.', errors);
                        });
                    } else { // if para los colores
                        console.log('(DRESS_UPDATE.JS) ERROR no se encontró ningún color.');
                    }
                }).catch(function(errors) {
                    console.log('(DRESS_UPDATE.JS) ERROR en la busqueda al recuperar los colores.', errors);
                });
            } else { // if para el estado del vestido
                console.log('(DRESS_UPDATE.JS) ERROR el vestido no puede ser editado.');
                res.send('(DRESS_UPDATE.JS) ERROR el vestido no puede ser editado.');
            }
        }).catch(function(errors) { // Aqui capturo errores?????. Cuál?. Talvez un error producido en la busqueda de los vestidos
            console.log('(DRESS_UPDATE.JS) ERROR (dress) en la busqueda. ' + errors); // Aqui presento el o los errores en el terminar
            res.send('(DRESS_UPDATE.JS) ERROR (dress) en la busqueda. ' + errors); // Aqui presento el o los errores en el navegador
        });
    }
});

/**
/ Medoto POST para la ruta dresses/update, para actualizar la informacion de un vestido
*/
router.post('/update', controlSession.isSession, controlDresses.isOwnerDress, function(req, res, next) {
    console.log('(DRESS_UPDATE.JS) Atendiendo la ruta /dresses/update POST');

    var dressId = req.body.dressId;

    if (dressId) {
        db.Dress.findOne({
            where: {
                id: dressId
            }
        }).then(function(dress) {
            console.log('(DRESS_UPDATE.JS) 1 forRent: ', dress.forRent, ' forSale: ', dress.forSale);
            dress.title = req.body.title;
            dress.description = req.body.description;
            dress.colorId = req.body.colorId;
            dress.brandId = req.body.brandId;
            dress.forRent = req.body.forRent ? true : false;
            dress.priceForRent = req.body.priceForRent;
            dress.forSale = req.body.forSale ? true : false;
            dress.priceForSale = req.body.priceForSale;
            dress.priceOriginal = req.body.priceOriginal;
            dress.stateId = 1;
            console.log('(DRESS_UPDATE.JS) 2 forRent: ', dress.forRent, '-', req.body.forRent, ' forSale: ', dress.forSale, '-', req.body.forSale);
            dress.save().then(function(dressNew) {
                console.log('(DRESS_UPDATE.JS) Vestido grabado correctamente.');
                // Recuperando los colores disponibles
                db.Color.findAll().then(function(colors) {
                    if (colors) {
                        console.log('(DRESS_UPDATE.JS) Encontrados: ', colors.length, ' colores.');
                        // Recuperando las marcar disponibles
                        db.Brand.findAll().then(function(brands) {
                            if (brands) {
                                console.log('(DRESS_UPDATE.JS) Encontrados: ', brands.length, ' marcas.');
                                console.log('(DRESS_UPDATE.JS) Mostrando form');
                                res.render('dresses/dress_update', {
                                    title: 'Node es una mierda, y mas mierda y mas mierda',
                                    pageTitle: 'Vestidos',
                                    pageName: 'dress_edit',
                                    sessionUser: req.session.userLoged,
                                    errors: null,
                                    dress: dressNew,
                                    colors: colors,
                                    brands: brands
                                });
                            } else {
                                console.log('(DRESS_UPDATE.JS) ERROR no se encontró ninguna marca.');
                            }
                        }).catch(function(errors) {
                            console.log('(DRESS_UPDATE.JS) Error en la busqueda de las marcas.');
                            res.send('(DRESS_UPDATE.JS) ERROR en la busqueda de las marcas. ' + errors);
                        });
                    } else {
                        console.log('(DRESS_UPDATE.JS) ERROR no se encontró ningún color.');
                    }
                }).catch(function(errors) {
                    console.log('(DRESS_UPDATE.JS) Error en la busqueda de los colores.');
                    res.send('(DRESS_UPDATE.JS) ERROR en la busqueda de los colores. ' + errors);
                });
            }).catch(function(errors) {
                console.log('(DRESS_UPDATE.JS) ERROR al grabar el vestido.');
                // Recuperando los colores disponibles
                db.Color.findAll().then(function(colors) {
                    if (colors) {
                        console.log('(DRESS_UPDATE.JS) Encontrados: ', colors.length, ' colores.');
                        // Recuperando las marcar disponibles
                        db.Brand.findAll().then(function(brands) {
                            if (brands) {
                                console.log('(DRESS_UPDATE.JS) Encontrados: ', brands.length, ' marcas.');
                                console.log('(DRESS_UPDATE.JS) Mostrando form');
                                res.render('dresses/dress_update', {
                                    title: 'Node es una mierda, y mas mierda y mas mierda',
                                    pageTitle: 'Vestidos',
                                    pageName: 'dress_edit',
                                    sessionUser: req.session.userLoged,
                                    errors: errors,
                                    dress: dress,
                                    colors: colors,
                                    brands: brands
                                });
                            } else {
                                console.log('(DRESS_UPDATE.JS) ERROR no se encontró ninguna marca.');
                            }
                        }).catch(function(errors) {
                            console.log('(DRESS_UPDATE.JS) Error en la busqueda de las marcas.');
                            res.send('(DRESS_UPDATE.JS) ERROR en la busqueda de las marcas. ' + errors);
                        });
                    } else {
                        console.log('(DRESS_UPDATE.JS) ERROR no se encontró ningún color.');
                    }
                }).catch(function(errors) {
                    console.log('(DRESS_UPDATE.JS) Error en la busqueda de los colores.');
                    res.send('(DRESS_UPDATE.JS) ERROR en la busqueda de los colores. ' + errors);
                });
            });
        }).catch(function(errors) {
            console.log('(DRESS_UPDATE.JS) ERROR en la busqueda del vestido. ' + errors);
            res.send('(DRESS_UPDATE.JS) ERROR en la busqueda del vestido. ' + errors);
        });
    } else {
        console.log('(DRESS_UPDATE.JS) ERROR el id del vestido no encontrado. ');
        res.send('(DRESS_UPDATE.JS) ERROR el id del vestido no encontrado. ');
    }
});

module.exports = router;