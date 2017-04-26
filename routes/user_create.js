/* cSpell:disable */
/* jslint node: true */

var express = require('express');
var router = express.Router();

var db = require('../models/db');
var global = require('../config/global');
var controlUser = require('../control/users');

// var IMAG_USER_ANON = 'http://res.cloudinary.com/cloud-dc/image/upload/v1487441736/brwltuenzajetyxciozo.png';

router.get('/create', function(req, res, next) {
    console.log('(USER_CREATE.JS) Atendiendo la ruta /users/create GET');
    console.log('Aqui nesecito mostrar un formulario vacio o lleno con los datos de un vestido ingresados. Pero con node tengo que usar sequelize. Porque no hay como separar la busqueda de la presentacion.');

    res.render('users/user_create', {
        title: 'Node es una mierda, y mas mierda y mas mierda',
        pageTitle: 'Usuarios',
        pageName: 'user_create',
        sessionUser: null,
        errors: null,
        user: null
    });
});

router.post('/create', function(req, res, next) {
    console.log('(USER_CREATE.JS) Atendiendo la ruta /users/create POST');
    console.log('Aqui nesecito mostrar un formulario vacio o lleno con los datos de un vestido ingresados. Pero con node tengo que usar sequelize. Porque no hay como separar la busqueda de la presentacion.');

    var user = {};
    user.nickname = req.body.nickname;
    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;
    user.email = req.body.email;
    user.birthdate = req.body.birthdate;
    user.authenticated = true;
    user.picture = global.IMAG_USER_ANON;

    var pass = req.body.password;
    var pass1 = req.body.password1;

    if (pass === pass1) {
        user.password = controlUser.encryptPassword(pass);
    } else {
        user.password = '';
    }
    db.user.create(user).then(function(userNew) {
        res.redirect('/users/' + userNew.id + '/edit');
    }).catch(function(errors) {
        res.render('users/user_create', {
            title: 'Node es una mierda, y mas mierda y mas mierda',
            pageTitle: 'Vestidos',
            pageName: 'user_create',
            sessionUser: null,
            errors: errors,
            user: user
        });
    });
});

module.exports = router;