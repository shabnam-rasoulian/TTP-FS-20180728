const router = require('express').Router()
const {Portfolio, Transaction, User} = require('../db/models')
module.exports = router

router.get('/:id', async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll({
      where: {userId: req.params.id}
    })
    res.json(transactions)
  } catch (err) {
    next(err)
  }
})

router.post('/:id/buy', async (req, res, next) => {
  try {
    const user = await User.findOne({where: {id: req.params.id}})
    const newBalance = user.balance - req.body.price * req.body.quantity
    if (user.balance < newBalance) {
      res.status(404).send('No enough fund!')
      return
    }
    const transaction = await Transaction.create({
      ticker: req.body.ticker,
      quantity: req.body.quantity,
      tradeType: 'buy',
      price: req.body.price,
      userId: req.params.id
    })

    const portfolio = await Portfolio.findOne({
      where: {userId: req.params.id, ticker: req.body.ticker}
    })
    if (!portfolio) {
      await Portfolio.create({
        ticker: req.body.ticker,
        quantity: req.body.quantity,
        userId: req.params.id
      })
    } else {
      const quantity = portfolio.quantity + Number(req.body.quantity)
      await Portfolio.update(
        {quantity: quantity},
        {where: {id: req.params.id, ticker: req.body.ticker}}
      )
    }
    await User.update({balance: newBalance}, {where: {id: req.params.id}})
    res.json(transaction)
  } catch (err) {
    next(err)
  }
})
