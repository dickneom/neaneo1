/* cSpell:disable */
/* jslint node: true */

// /models.brands.js

module.exports = function(sequelize, DataTypes) {
    var Brand = sequelize.define('Brand', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        brand: {
            type: DataTypes.TEXT
        },
        active: {
            type: DataTypes.BOOLEAN
        }
    }, {
        tableName: 'dresses_brands',
        timestamps: false,
        underscored: true,
        paranoid: true
            // aqui faltan las relaciones
    });

    return Brand;
};