const Sequelize = require('sequelize');

const database = new Sequelize('games','postgres','dwpq2jnza4',{
    host:'localhost',
    dialect:'postgres',
    dialectOptions:{

    }
})

module.exports = database;