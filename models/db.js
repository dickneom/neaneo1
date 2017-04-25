/* cSpell:disable */
/* jslint node: true */

var Sequelize = require('sequelize');

// PARA BASE DE DATOS SQLITE PARA DESARROLLO
var sequelize = new Sequelize('', '', '', {
    dialect: 'sqlite',
    storage: './db/dc.db',
    define: {
        //    timestamps: false,
        freezeTableName: true
    }
});

// PARA BASE DE DATOS POSTGRES PARA PRUEBAS
/*var sequelize = new Sequelize('avd_test', 'dickneom', '1', {
    host: 'localhost',
    dialect: 'postgres',
    define: {
        freezeTableName: true,
        underscored: true
    }
});*/

// PARA BASE DE DATOS POSTGRES PARA PRODUCCION
/*var sequelize = new Sequelize('dc_test', 'dickneom', '1', {
  host: 'localhost',
  dialect: 'postgres',
  define: {
    freezeTableName: true,
    underscored: true
  }
});*/

/*sequelize.sync({
    force: true
}).then(function(error) {
    console.log('(DB.JS) Base de Datos creada');
});*/

// conentando los modelos, relaciones en la base de datos en un db objeto
var db = {};

// db.sync = function() {
//     console.log('(DB.JS) Sincronizando');
//     sequelize.sync({
//         force: true
//     }).then(function() {
//         console.log('(DB.JS) Base de datos creada');
//     }).catch(function(error) {
//         console.log('(DB.JS) ERROR al crear la base de datos: ', error);
//     });
// };

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Modelos - Tablas
db.User = require('./users')(sequelize, Sequelize);
db.Dress = require('./dresses')(sequelize, Sequelize);
db.Color = require('./dress_colors')(sequelize, Sequelize);
db.Brand = require('./dress_brands')(sequelize, Sequelize);
db.Catego = require('./dress_categos')(sequelize, Sequelize);
db.State = require('./dress_states')(sequelize, Sequelize);
db.Photo = require('./dress_photos')(sequelize, Sequelize);
db.Message = require('./messages')(sequelize, Sequelize);
db.Like = require('./likes')(sequelize, Sequelize);

// Relaciones
// Dress1 - User1 - Un vestido tine registrado un usuario propietario
db.Dress.belongsTo(db.User, {
    //foreignKey: 'user_id',
    as: 'user'
});

// Dress1 - Color1 - Un vestido registra un color
db.Dress.belongsTo(db.Color, {
    //foreignKey: 'color_id',
    as: 'color'
});

// Dress1 - Photos* - Un vestido puede tener varias fotos
db.Dress.hasMany(db.Photo, {
    //foreignKey: 'dress_id',
    as: 'photos'
});

// Dress1 - Brand1 - Un vestido registra una marca
db.Dress.belongsTo(db.Brand, {
    //foreignKey: 'brand_id',
    as: 'brand'
});

// Dress1 - State1 - Un vestido registra un estado
db.Dress.belongsTo(db.State, {
    //foreignKey: 'state_id',
    as: 'state'
});

// Dress1 - Categoria1 - Un vestido registra una categoria
db.Dress.belongsTo(db.Catego, {
    //foreignKey: 'categoId',
    as: 'catego'
});

// User1 - Dress* - Un usuario esta registrado en muchos vestidos
/*db.User.hasMany(db.Dress, {
    //foreignKey: 'userId',
    as: 'dress'
});*/

// Message* - User1 - Un mensaje es para un usuario
db.Message.belongsTo(db.User, {
    foreignKey: 'userIdTo',
    as: 'userTo'
});

// Message* - User1 - Un mensaje es enviado por un usuario
db.Message.belongsTo(db.User, {
    foreignKey: 'userIdFrom',
    as: 'userFrom'
});

// User1 - Message* - Un usuario puede recibir muchos mensajes
db.User.hasMany(db.Message, {
    foreignKey: 'userIdTo',
    as: 'userTo'
});

// User1 - Message* - Un usuario puede enviar muchos mensajes
db.User.hasMany(db.Message, {
    foreignKey: 'userIdFrom',
    as: 'userFrom'
});

// Dress1 - Like* - Un vestido puede tener muchos likes
db.Dress.hasMany(db.Like, {
    //foreignKey: 'dressId',
    as: 'Likes'
});

// Like1 - Dress1 - Un like es para un vestido
db.Like.belongsTo(db.Dress, {
    //foreignKey: 'dressId',
    as: 'dress'
});

// User1 - Like* - Un usuario puede dar muchos likes
db.User.hasMany(db.Like, {
    //foreignKey: 'userId',
    as: 'Likes'
});

// Like1 - User1 - Un like es dado por un solo usuario
/* db.Like.belongsTo(db.USer, {
  foreignKey: 'userId',
  as: 'user'
}) */

module.exports = db;