const bcrypt = require("bcryptjs");
const { User, Spot, Booking, Review, Image } = require("../models");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Seed Users
        const users = await User.bulkCreate(
            [
                {
                    firstName: "First",
                    lastName: "Last",
                    email: "demo@user.io",
                    username: "Demo-lition",
                    hashedPassword: bcrypt.hashSync("password"),
                },
                {
                    firstName: "John",
                    lastName: "Doe",
                    email: "john@doe.com",
                    username: "john_doe",
                    hashedPassword: bcrypt.hashSync("password"),
                },
            ],
            { validate: true }
        );

        // Seed Spots
        // const firstUser = await User.findOne({ order: [["createdAt", "ASC"]] });
        // if (firstUser) {
            await Spot.bulkCreate([
                {
                    ownerId: 1,
                    address: "123 Disney Lane",
                    city: "San Francisco",
                    state: "California",
                    country: "United States of America",
                    lat: 37.7645358,
                    lng: -122.4730327,
                    name: "App Academy",
                    description: "Place where web developers are created",
                    price: 123,
                },
            ]);
        // }

        // Seed Bookings
        await Booking.bulkCreate([
            {
                spotId: 1,
                userId: 2,
                startDate: "2023-11-19",
                endDate: "2023-11-20",
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
        ]);

        // Seed Images
        await Image.bulkCreate([
            {
                imageableType: "Spot",
                imageableId: 1,
                url: "https://airBarnBats.com/Spot1.jpg",
                preview: true,
            },
            {
                imageableType: "Review",
                imageableId: 1,
                url: "https://airBarnBats.com/Review1.jpg",
                preview: true,
            },
            {
                imageableType: "User",
                imageableId: 1,
                url: "https://airBarnBats.com/User1.jpg",
                preview: true,
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await Booking.destroy({ where: {} });
        await Review.destroy({ where: {} });
        await Image.destroy({ where: {} });
        await Spot.destroy({ where: {} });
        await User.destroy({ where: {} });
    },
};
