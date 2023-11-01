"use strict";

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
const { Spot, User, Booking, Review, Image } = require("../models");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Seed Bookings
        await Booking.bulkCreate([
            {
                spotId: 1,
                userId: 2,
                startDate: "2023-11-19",
                endDate: "2023-11-20",
            },
            {
                spotId: 2,
                userId: 1,
                startDate: "2023-11-21",
                endDate: "2023-11-22",
            },
        ]);

        // Seed Reviews
        await Review.bulkCreate([
            {
                userId: 1,
                spotId: 1,
                review: "This was an awesome spot!",
                stars: 5,
            },
            {
                userId: 2,
                spotId: 2,
                review: "Not bad, could be better.",
                stars: 3,
            },
        ]);

        // Seed Images
        await Image.bulkCreate([
            {
                imageableType: "Spot",
                imageableId: 1,
                url: "https://example.com/image1.jpg",
                preview: true,
            },
            {
                imageableType: "Review",
                imageableId: 1,
                url: "https://example.com/image2.jpg",
                preview: false,
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await Booking.destroy({ where: {} });
        await Review.destroy({ where: {} });
        await Image.destroy({ where: {} });
    },
};
