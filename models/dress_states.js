/* cSpell:disable */
/* jslint node: true */

// /models.states.js

module.exports = function(sequelize, DataTypes) {
    var State = sequelize.define('State', {
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
        tableName: 'dresses_states',
        timestamps: false,
        underscored: true,
        paranoid: true
            // aqui faltan las relaciones
    });

    return State;
};