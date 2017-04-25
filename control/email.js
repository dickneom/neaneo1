/* cSpell:disable */
/* jslint node: true */

/**
/ Encripta un mensaje
*/
function encryptEmail(message) {
    console.log('(EMAIL.JS) *** *** *** *** Encriptando mensaje de email');
    console.log('(EMAIL.JS) *** *** *** *** Original: ', message);
    message = message + ';a1';
    console.log('(EMAIL.JS) *** *** *** *** Encriptado: ', message);
    return message;
}

/**
/ Desencripta el mensaje encriptado con la funcion anterior
*/
function decryptEmail(message) {
    console.log('(EMAIL.JS) *** *** *** *** Desencriptando mensaje de email');
    console.log('(EMAIL.JS) *** *** *** *** Encriptado: ', message);
    message = message.split(';')[0];
    console.log('(EMAIL.JS) *** *** *** *** Desencriptado: ', message);
    return message;
}

/**
/ Envia un email, dato el email destino y el mensaje a enviar
/ El remitente es el correo del sistema
*/
function sendSystemEmail(email, subject, message) {
    console.log('(EMAIL.JS) *** *** *** Email enviado a:');
    console.log('(EMAIL.JS) *** *** *** *** From: System');
    console.log('(EMAIL.JS) *** *** *** *** To: ' + email);
    console.log('(EMAIL.JS) *** *** *** *** Subject: ' + subject);
    console.log('(EMAIL.JS) *** *** *** *** Message: ' + message);
}

module.exports.encryptEmail = encryptEmail;
module.exports.decryptEmail = decryptEmail;
module.exports.sendSystemEmail = sendSystemEmail;