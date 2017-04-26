/* cSpell:disable */
/* jslint node: true */

// /routes/dress_buy.js permite comprar o alquilar vetidos

var express = require('express');
var router = express.Router();

var db = require('../models/db');
var global = require('../config/global');
var controlSession = require('../control/session');

router.get('/:dressId/buy', controlSession.isSession, function(req, res, next) {
    var dressId = req.params.dressId;

    if (dressId) {
        db.Dress.findOne({
            where: {
                id: dressId
            }
        }).then(function(dress) {
            dress.stateId = 4;
            dress.save().then(function(dress) {
                console.log('(DRESSES_BUY.JS) Vestido comprado. dress: ', dressId);

            }).catch(function(errors) {
                console.log('(DRESSES_BUY.JS) ERROR en la busqueda del vestido.');
                res.send('(DRESSES_BUY.JS) ERROR en la busqueda del vestido.');
            });
        }).catch(function(errors) {
            console.log('(DRESSES_BUY.JS) ERROR en la busqueda del vestido.');
            res.send('(DRESSES_BUY.JS) ERROR en la busqueda del vestido.');
        });
    } else {
        console.log('(DRESSES_BUY.JS) ERROR id del vestido no encontrado.');
        res.send('(DRESSES_BUY.JS) ERROR id del vestido no encontrado.');
    }
});

router.get('/:dressId/buy_cancel', controlSession.isSession, function(req, res, next) {
    var dressId = req.params.dressId;

    if (dressId) {

    } else {
        console.log('(DRESSES_BUY.JS) ERROR id del vestido no encontrado.');
        res.send('(DRESSES_BUY.JS) ERROR id del vestido no encontrado.');
    }
});

router.get('/:dressId/rent', controlSession.isSession, function(req, res, next) {
    var dressId = req.params.dressId;

    if (dressId) {

    } else {
        console.log('(DRESSES_BUY.JS) ERROR id del vestido no encontrado.');
        res.send('(DRESSES_BUY.JS) ERROR id del vestido no encontrado.');
    }
});

router.get('/:dressId/rent_cancel', controlSession.isSession, function(req, res, next) {
    var dressId = req.params.dressId;

    if (dressId) {

    } else {
        console.log('(DRESSES_BUY.JS) ERROR id del vestido no encontrado.');
        res.send('(DRESSES_BUY.JS) ERROR id del vestido no encontrado.');
    }
});

module.exports = router;