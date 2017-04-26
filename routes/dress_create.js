/* cSpell:disable */
/* jslint node: true */

var express = require('express');
var router = express.Router();

var db = require('../models/db');
var global = require('../config/global');
var controlSession = require('../control/session');

// var IMAG_DRESS_ANON = 'http://res.cloudinary.com/cloud-dc/image/upload/v1487441736/brwltuenzajetyxciozo.png';

router.get('/create', controlSession.isSession, function(req, res, next) {
    console.log('(DRESS_CREATE.JS) Atendiendo la ruta /dresses/create GET');
    console.log('Aqui nesecito mostrar un formulario vacio o lleno con los datos de un vestido ingresados. Pero con node tengo que usar sequelize. Porque no hay como separar la busqueda de la presentacion.');
    db.Color.findAll().then(function(colors) {
        db.Brand.findAll().then(function(brands) {
            res.render('dresses/dress_create', {
                title: 'Node es una mierda, y mas mierda y mas mierda',
                pageTitle: 'Vestidos',
                pageName: 'dress_create',
                sessionUser: req.session.userLoged,
                errors: null,
                dress: null,
                brands: brands,
                colors: colors
            });
        });
    });
});

router.post('/create', controlSession.isSession, function(req, res, next) {
    console.log('(DRESS_CREATE.JS) Atendiendo la ruta /dresses/create POST');
    console.log('Aqui nesecito mostrar un formulario vacio o lleno con los datos de un vestido ingresados. Pero con node tengo que usar sequelize. Porque no hay como separar la busqueda de la presentacion.');

    var dress = {};
    dress.title = req.body.title;
    dress.description = req.body.description;
    dress.colorId = req.body.colorId;
    dress.brandId = req.body.brandId;
    dress.priceForSale = req.body.priceForSale;
    dress.priceForRent = req.body.priceForRent;
    dress.priceOriginal = req.body.priceOriginal;
    dress.userId = req.body.userId;
    dress.image = global.IMAG_DRESS_ANON;

    db.Dress.create(dress).then(function(dressNew) {
        res.redirect('/dresses/' + dressNew.id + '/update');
    }).catch(function(errors) {
        db.Color.findAll().then(function(colors) {
            db.Brand.findAll().then(function(brands) {
                res.render('dresses/dress_create', {
                    title: 'Node es una mierda, y mas mierda y mas mierda',
                    pageTitle: 'Vestidos',
                    pageName: 'dress_create',
                    sessionUser: req.session.userLoged,
                    errors: errors,
                    dress: dress,
                    brands: brands,
                    colors: colors
                });
            });
        });
    });
});

module.exports = router;