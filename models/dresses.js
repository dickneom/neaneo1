/* cSpell:disable */
/* jslint node: true */

// /models.dresses.js

module.exports = function(sequelize, DataTypes) {
    var Dress = sequelize.define('Dress', {
        id: { //
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: { //
            type: DataTypes.TEXT
        },
        description: { //
            type: DataTypes.TEXT
        },
        colorId: {
            type: DataTypes.INTEGER,
            field: 'color_id'
        },
        brandId: { // Marca del vestido
            type: DataTypes.INTEGER,
            field: 'brand_id'
        },
        priceForSale: { // precio de venta //
            type: DataTypes.NUMERIC,
            field: 'price_for_sale'
        },
        priceOriginal: { // Precio del mercado o precio en que fue comprado //
            type: DataTypes.NUMERIC,
            field: 'price_original'
        },
        priceForRent: { // precio de alquiler //
            type: DataTypes.NUMERIC,
            field: 'price_for_rent'
        },
        forSale: { //
            type: DataTypes.BOOLEAN,
            field: 'for_sale'
        },
        forRent: { //
            type: DataTypes.BOOLEAN,
            field: 'for_rent'
        },
        categoId: { // Noche, Dia, Novia, Quinceañera...
            type: DataTypes.INTEGER,
            field: 'catego_id'
        },
        long: { // Largo, medio o corto
            type: DataTypes.TEXT
        },
        size: { // Talla
            type: DataTypes.TEXT
        },
        image: {
            type: DataTypes.TEXT
        },
        stateId: {
            type: DataTypes.INTEGER,
            field: 'state_id'
        },
        userId: { // id el usuario dueño del vestido
            type: DataTypes.INTEGER,
            field: 'user_id'
        },
        /*        createdAt: { // Fecha en qeue se registro el vestido (creacion)
                    type: DataTypes.DATE,
                    field: 'created_at'
                },
                updatedAt: {
                    type: DataTypes.DATE,
                    field: 'updated_at'
                },
                deletedAt: {
                    type: DataTypes.DATE,
                    field: 'deleted_at'
                },*/
        publicatedAt: { // Fecha en que fue publicado (puesto en venta)
            type: DataTypes.DATE,
            field: 'publicated_at'
        },
        soldAt: { // Fecha en que fue comprado o vendido
            type: DataTypes.DATE,
            field: 'sold_at'
        }
    }, {
        tableName: 'dresses',
        timestamps: true,
        underscored: true,
        paranoid: true
            // aqui faltan las relaciones
    });

    return Dress;
};