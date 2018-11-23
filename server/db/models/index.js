const Portfolio = require('./portfolio')
const Transaction = require('./transaction')
const User = require('./user')

Transaction.belongsTo(User)
User.hasMany(Transaction)

Portfolio.belongsTo(User)
User.hasOne(Portfolio)

module.exports = {
  Portfolio,
  Transaction,
  User
}
