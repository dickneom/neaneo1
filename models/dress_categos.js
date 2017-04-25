/* cSpell:disable */
/* jslint node: true */

// /models.brands.js

module.exports = function(sequelize, DataTypes) {
    var Catego = sequelize.define('Catego', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.TEXT
        },
        description: {
            type: DataTypes.TEXT
        },
        active: {
            type: DataTypes.BOOLEAN
        }
    }, {
        tableName: 'dresses_categos',
        timestamps: false,
        underscored: true,
        paranoid: true
            // aqui faltan las relaciones
    });

    return Catego;
};