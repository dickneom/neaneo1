/* cSpell:disable */
/* jslint node: true */

// /models.colors.js

module.exports = function(sequelize, DataTypes) {
    var Color = sequelize.define('Color', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        color: {
            type: DataTypes.TEXT
        },
        active: {
            type: DataTypes.BOOLEAN
        }
    }, {
        tableName: 'dresses_colors',
        timestamps: false,
        underscored: true,
        paranoid: true
            // aqui faltan las relaciones
    });

    return Color;
};