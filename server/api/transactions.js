const router = require('express').Router()
const {Portfolio, Transaction, User} = require('../db/models')
const db = require('../db/db')
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
    let transaction
    await db.transaction(async function(tt) {
      const user = await User.findOne({
        where: {id: req.params.id},
        lock: tt.LOCK.UPDATE
      })
      const newBalance = user.balance - req.body.price * req.body.quantity
      if (user.balance < newBalance) {
        res.status(404).send('No enough fund!')
        return
      }
      transaction = await Transaction.create({
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
          {where: {userId: req.params.id, ticker: req.body.ticker}}
        )
      }
      await User.update({balance: newBalance}, {where: {id: req.params.id}})
    })
    res.json(transaction)
  } catch (err) {
    next(err)
  }
})

router.post('/:id/sell', async (req, res, next) => {
  try {
    let transaction
    await db.transaction(async function(tt) {
      const portfolio = await Portfolio.findOne({
        where: {userId: req.params.id, ticker: req.body.ticker}
      })
      if (!portfolio) {
        res.status(404).send('No such portfolio for this user!')
        return
      }
      const newQuantity = portfolio.quantity - Number(req.body.quantity)
      if (newQuantity > 0) {
        await Portfolio.update(
          {quantity: newQuantity},
          {where: {userId: req.params.id, ticker: req.body.ticker}}
        )
      } else {
        await Portfolio.destroy({
          where: {userId: req.params.id, ticker: req.body.ticker}
        })
      }
      transaction = await Transaction.create({
        ticker: req.body.ticker,
        quantity: req.body.quantity,
        price: req.body.price,
        tradeType: 'sell',
        userId: req.params.id
      })
      const user = await User.findOne({
        where: {id: req.params.id},
        lock: tt.LOCK.UPDATE
      })
      const newBalance = user.balance + req.body.price * req.body.quantity
      await User.update({balance: newBalance}, {where: {id: req.params.id}})
    })
    res.json(transaction)
  } catch (err) {
    next(err)
  }
})
