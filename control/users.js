/* cSpell:disable */
/* jslint node: true */

// /control/users.js

// var db = require('../models/db')

/**
/ Encripta el password
*/
/* module.exports.encryptPassword = function encryptPassword (pass) {
  console.log('(USERS.JS) *** *** *** *** Encriptando password - sin callback')
  var encript = pass + 'a1'
  // falta el algoritmo de algoritmo de encript amiento
  return encript
} */

/**
/ Encripta el password, incluyendo una callback
*/
module.exports.encryptPassword = function encryptPassword(pass, cb) {
    console.log('(USERS.JS) *** *** *** *** Encriptando password - callback');
    var encript = pass + 'a1';
    // falta el algoritmo de algoritmo de encriptamiento
    cb(encript);
};