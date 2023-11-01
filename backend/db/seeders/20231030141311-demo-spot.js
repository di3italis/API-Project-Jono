"use strict";

const { Spot } = require("../models");
const { User } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        const firstUser = await User.findOne({
            order: [["createdAt", "ASC"]],
        });

    if (firstUser) {

      await Spot.bulkCreate([
          {
              ownerId: firstUser.id,
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
        }

    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        options.tableName = "Spots";
        const Op = Sequelize.Op;
        return queryInterface.bulkDelete(
            options,
            {
                address: "123 Disney Lane",
                // address: {
                // [Op.in]: ["123 Disney Lane"],
                // },
            },
            {}
        );
    },
};
