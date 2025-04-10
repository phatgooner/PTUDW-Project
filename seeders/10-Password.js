'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const models = require('../models');
        const bcrypt = require('bcrypt');

        //update hash password for all users
        let users = await models.User.findAll();
        let updatedUsers = [];
        users.forEach(user => {
            let hash = bcrypt.hashSync("Demo@123", 8);
            updatedUsers.push({
                id: user.id,
                password: hash
            });
        });
        await models.User.bulkCreate(updatedUsers, {
            updateOnDuplicate: ['password'],
        });
    },

    async down(queryInterface, Sequelize) {

    }
};
