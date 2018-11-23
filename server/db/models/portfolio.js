const Sequelize = require('sequelize')
const db = require('../db')

const Portfolio = db.define('portfolio', {
  ticker: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  }
})

module.exports = Portfolio
