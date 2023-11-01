"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Image extends Model {
        getImageable(options) {
            if (!this.imageableType) return Promise.resolve(null);
            const mixinMethodName = `get${this.imageableType}`; // getUser or getSpot or getReview
            return this[mixinMethodName](options);
        }

        static associate(models) {
            Image.belongsTo(models.User, {
                foreignKey: "imageableId",
                constraints: false,
            });
            Image.belongsTo(models.Spot, {
                foreignKey: "imageableId",
                constraints: false,
            });
            Image.belongsTo(models.Review, {
                foreignKey: "imageableId",
                constraints: false,
            });
        }
    }
    Image.init(
        {
            imageableType: {
                type: DataTypes.ENUM("User", "Spot", "Review"),
                allowNull: false,
            },
            imageableId: {
                type: DataTypes.INTEGER,
                allowNull: false, //? need this?
            },
            url: {
                type: DataTypes.STRING,
                allowNull: false, //? need this?
            },
            preview: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Image",
        }
    );
    return Image;
};
