/* cSpell:disable */
/* jslint node: true */

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    console.log('*************** Atendiendo la ruta: /logout GET');
    req.session.destroy(function(errors) {
        if (errors) {
            console.log('*** ERROR: ' + errors);
            return;
        } else {
            // req.session.user = null
            // req.session = null
            console.log('*** Session: ' + req.session);
            // console.log('*** Session: ' + req.session.user)
            res.redirect('/');
        }
    });
});

module.exports = router;