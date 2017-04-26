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
var global = require('../config/global');
var controlSession = require('../control/session');
var controlDresses = require('../control/dresses');

/**
/ Medoto GET para la ruta dresses/:idDress/update, para actualizar la informacion de un vestido
*/
router.get('/:dressId([0-9]+)/images', controlSession.isSession, controlDresses.isOwnerDress, function(req, res, next) {
    console.log('(DRESS_IMAGES.JS) Atendiendo la ruta /dresses/:dressId/images GET');
    console.log('Aqui nesecito presentar el vestido a editar. Pero con node tengo que usar sequelize. Porque no hay como separar la busqueda de la presentacion.');

    // Lo que quiero hacer:
    // Determinar el vestido a mostrar
    // dress = getDress(dressId) // getVestido es una funcion parte del modelo que me devuelve un vestido
    // showDress(dress) // showDress es una funcion que muestra un vestido
    // Respuesta encontrada con node: TODO JUNTO. buscar el vestido, que hacer con el vestido, y capaturar el error, y ver que hacer con el error

    // Esto deberia estar aqui
    var dressId = req.params.dressId;
    console.log('(DRESS_UPDATE.JS) dressId: ', dressId);

    if (dressId) {
        // Esto deberia se parte del modelo o control
        db.Dress.findOne({
            where: {
                id: dressId
            },
            include: {
                model: db.Photo,
                as: 'photos'
            }
        }).then(function(dress) { // Agui meto una funcion anonima porque nadie sabe (ni Google) como ponerla afuera, si ya sé que este codigo lo voy a utilizar de nuevo, pero a reescribir, que mas dá
            console.log('(DRESS_IMAGES.JS) Vestido encontrado. dress: ', dress.id);

            // Determinar el usuario logeado, null si no esta logeado
            var userLoged = null;
            if (req.session.userLoged) {
                userLoged = req.session.userLoged;
            }
            // Esto deberia ser parte del control, deberia ser una funcion, para reutilizar
            console.log('(DRESS_IMAGES.JS) Mostrando vestido para edicion.');
            res.render('dresses/dress_images', {
                title: 'Node es una mierda, y mas mierda y mas mierda',
                pageTitle: 'Agregar imagen al vestido',
                pageName: 'dress_images',
                sessionUser: userLoged,
                errors: null,
                dress: dress,
                defaultImage: global.IMAG_DRESS_ANON
            });
        }).catch(function(errors) { // Aqui capturo errores?????. Cuál?. Talvez un error producido en la busqueda de los vestidos
            console.log('(DRESS_IMAGES.JS) ERROR (dress) en la busqueda. ' + errors); // Aqui presento el o los errores en el terminar
            res.send('(DRESS_IMAGES.JS) ERROR (dress) en la busqueda. ' + errors); // Aqui presento el o los errores en el navegador
        });
    }
});

/**
/ Medoto POST para la ruta dresses/update, para actualizar la informacion de un vestido
*/
router.post('/images',
    controlSession.isSession,
    uploader.array('image', 6, function(error) {
        console.log('(DRESS_IMAGES.JS) Error al subir las imagenes: ', error);
    }),
    controlDresses.isOwnerDress,
    function(req, res, next) {
        console.log('(DRESS_IMAGES.JS) Atendiendo la ruta /dresses/images POST');
        console.log('(DRESS_IMAGES.JS) Archivos:', req.files);

        if (req.files && req.files.length > 0) {
            var numImagenes = req.files.length;
            console.log('(DRESS_IMAGES.JS) Numero de archivos:', numImagenes);

            var dressId = req.body.dressId;
            console.log('(DRESS_IMAGES.JS) Vestido id:', dressId);
            if (dressId) {
                db.Dress.findOne({
                    where: {
                        id: dressId
                    }
                }).then(function(dress) {
                    console.log('(DRESS_IMAGES.JS) Encontrado el vestido: ', dressId);

                    // por cada foto
                    //   Verificar si la foto fue subida
                    //   Verificar que no haya en total mas de 6 fotos
                    //      Una forma: seria eliminar todas las imagenes y cargar las nuevas
                    //      Otra: verificar las imagenes subidas anteriores
                    //   Enviar la fotos a cloudinari
                    //   Agregar las fotos a dresses_photos
                    //
                    // Cambiar el estado el vestido a 1 (REGISTRADO)
                    console.log('(DRESS_IMAGES.JS) IMAGENES');
                    console.log('(DRESS_IMAGES.JS) Mostrando los seis vestidos registrado anteriormente.');
                    var imgUrl;
                    for (var k = 0; k < 6; k++) {
                        imgUrl = req.body.imageUrl[k];
                        console.log('(DRESS_IMAGES.JS) Imagen: ', imgUrl, ' k:', k);
                    }

                    console.log('(DRESS_IMAGES.JS) Mostrando los seis vestidos ingresados ahora.');
                    for (var i = 0; i < 6; i++) {
                        if (req.files[i]) {
                            console.log('Cargando imagenes: ', i, ' - ', req.files[i].path);
                        } else {
                            console.log('Cargando imagenes: ', i, ' - ', 'NINGUNA');
                        }
                    }

                    //                var numImagenes = req.files.length;
                    //                console.log('(DRESS_IMAGES.JS) Mostrando los vestidos añadidos.', numImagenes);
                    //                for (var j = 0; j < numImagenes; j++) {
                    //                    console.log('Cargando imagenes: ', req.files[j].path);

                    /*          cloudinary.uploader.upload(req.file[i].path, function (result) {
                                var fileUrl = result.url
                                // var fileSecureUrl = result.secure_url

                                // dress.image = fileUrl
                                dress.stateId = 1
                                console.log('********* Vestido a grabar: ' + dress)

                                console.log('Cargando imagenes: ', req.files[i].path)

                                dress.save().then(function (dressNew) {
                                console.log('(DRESS_IMAGES.JS) Vestido grabado correctamente.')
                                res.render('dresses/dress_images', {
                                    pageTitle: 'Agregar imagen al vestido: ' + dress.title,
                                    pageName: 'dress_images',
                                    sessionUser: req.session.userLoged,
                                    errors: null,
                                    dress: dressNew
                                })
                                }).catch(function (errors) {
                                console.log('(DRESS_IMAGES.JS) Vestido no se grabo.')
                                res.render('dresses/dress_images', {
                                    pageTitle: 'Agregar imagen al vestido: ' + dress.title,
                                    pageName: 'dress_images',
                                    sessionUser: req.session.userLoged,
                                    errors: errors,
                                    dress: dress
                                })
                                })
                            }) */
                    //                }
                    res.send('(DRESS_IMAGES.JS) Grabado todo.');
                }).catch(function(errors) {
                    console.log('(DRESS_IMAGES.JS) ERROR en la busqueda del vestido', errors);
                    res.send('(DRESS_IMAGES.JS) ERROR en la busqueda del vestido. '.errors);
                });
            } else {
                console.log('(DRESS_IMAGES.JS) ERROR el id del vestido no encontrado. ');
                res.send('(DRESS_IMAGES.JS) ERROR el id del vestido no encontrado. ');
            }
        } else {
            console.log('(DRESS_IMAGES.JS) ERROR ningun archivo pasado.');
            res.send('(DRESS_IMAGES.JS) ERROR ningun archivo pasado.');
        }
    }
);

module.exports = router;