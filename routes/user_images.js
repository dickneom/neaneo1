/* cSpell:disable */
/* jslint node: true */

var express = require('express');
var router = express.Router();

// PARA SUBIR LAS IMAGENES A CLOUDINARY
var cloudinary = require('cloudinary'); // sitio web para almacenar imagenes
var multer = require('multer'); // Para subir archivo (imagenes)
var uploader = multer({ dest: './uploads' });

// configuracion de cloudinary para dresscloset
cloudinary.config({
    cloud_name: 'cloud-dc',
    api_key: '315662672528822',
    api_secret: 'HaVwA3NVQfm5cVMeTKYU3O5Di7s'
});

var db = require('../models/db');
var controlSession = require('../control/session');
// var controlDresses = require('../control/dresses')

router.get('/:userId([0-9]+)/images', controlSession.isSession, function(req, res, next) {
    console.log('(USER_IMAGES.JS) Atendiendo la ruta /users/:userId/images GET');

    var userId = req.params.userId;
    console.log('/USER_IMAGES.JS) userId: ', userId);

    if (userId) {
        // Esto deberia se parte del modelo o control
        db.User.findOne({
            where: {
                id: userId
            }
        }).then(function(user) { // Agui meto una funcion anonima porque nadie sabe (ni Google) como ponerla afuera, si ya sé que este codigo lo voy a utilizar de nuevo, pero a reescribir, que mas dá
            // var date = user.birthdate.getDate()
            console.log('(USER_IMAGES.JS) usuario encontrado. user: ', user.id);

            // Esto deberia ser parte del control, deberia ser una funcion, para reutilizar
            res.render('users/user_images', {
                title: 'Node es una mierda, y mas mierda y mas mierda',
                pageTitle: 'Imagen del usuario',
                pageName: 'user_images',
                sessionUser: req.session.userLoged,
                errors: null,
                user: user
            });
        }).catch(function(errors) { // Aqui capturo errores?????. Cuál?. Talvez un error producido en la busqueda de los usuarios
            console.log('(USER_IMAGES.JS) ERROR en la busqueda. ' + errors); // Aqui presento el o los errores en el terminar
            res.send('(USER_IMAGES.JS) ERROR en la busqueda. ' + errors); // Aqui presento el o los errores en el navegador
        });
    }
});

router.post('/images', controlSession.isSession, uploader.single('image'), function(req, res, next) {
    console.log('(USERS_IMAGES.JS) Atendiendo la ruta /users/images POST');
    if (req.file) {
        var userId = req.body.userId;

        if (userId) {
            db.User.findOne({
                where: {
                    id: userId
                }
            }).then(function(user) {
                cloudinary.uploader.upload(req.file.path, function(result) {
                    var fileUrl = result.url;
                    // var fileSecureUrl = result.secure_url

                    user.picture = fileUrl;
                    console.log('(USERS_IMAGES.JS) ********* Usuario a grabar: ' + user);

                    user.save().then(function(userNew) {
                        console.log('(USER_IMAGES.JS) Usuario grabado correctamente.');
                        res.render('users/user_images', {
                            pageTitle: 'Agregar imagen al usuario: ' + user.nickname,
                            pageName: 'user_images',
                            sessionUser: req.session.userLoged,
                            errors: null,
                            user: userNew
                        });
                    }).catch(function(errors) {
                        console.log('(USER_IMAGES.JS) Usuario no se grabo.');
                        res.render('users/user_images', {
                            pageTitle: 'Agregar imagen al usuario: ' + user.nickname,
                            pageName: 'user_images',
                            sessionUser: req.session.userLoged,
                            errors: errors,
                            user: user
                        });
                    });
                });
            }).catch(function(errors) {
                console.log('(USER_IMAGES.JS) ERROR en la busqueda del usuario.');
                res.send('(USER_IMAGES.JS) ERROR en la busqueda del usuario.');
            });
        } else {
            console.log('(USER_IMAGES.JS) ERROR el id del usuario no encontrado. ');
            res.send('(USER_IMAGES.JS) ERROR el id del usuario no encontrado. ');
        }
    } else {
        console.log('(USER_IMAGES.JS) ERROR ningun archivo pasado.');
        res.send('(USER_IMAGES.JS) ERROR ningun archivo pasado.');
    }
});

module.exports = router;