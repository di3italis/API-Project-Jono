"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Reviews", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            userId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: { model: "Users", key: "id" },
                onDelete: "CASCADE",
            },
            spotId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: { model: "Spots", key: "id" },
                onDelete: "CASCADE",
            },
            review: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            stars: {
                type: Sequelize.INTEGER,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Reviews");
    },
};
