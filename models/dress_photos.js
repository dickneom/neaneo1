/* cSpell:disable */
/* jslint node: true */

// /models.dresses_photos.js

module.exports = function(sequelize, DataTypes) {
    var Photo = sequelize.define('Photo', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        dressId: {
            type: DataTypes.TEXT,
            field: 'dress_id'
        },
        photo_url: {
            type: DataTypes.TEXT
        },
        photo: {
            type: DataTypes.BLOB
        },
        description: {
            type: DataTypes.TEXT
        }
    }, {
        tableName: 'dresses_photos',
        timestamps: true,
        underscored: true,
        paranoid: true
            // aqui faltan las relaciones
    });

    return Photo;
};