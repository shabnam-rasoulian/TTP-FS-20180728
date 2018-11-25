const router = require('express').Router()
const {Portfolio} = require('../db/models')
module.exports = router

router.get('/:id', async (req, res, next) => {
  try {
    const portfolios = await Portfolio.findAll({
      where: {userId: req.params.id}
    })
    res.json(portfolios)
  } catch (err) {
    next(err)
  }
})

router.get('/:id/:ticker', async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({
      where: {userId: req.params.id, ticker: req.params.ticker}
    })
    res.json(portfolio)
  } catch (err) {
    next(err)
  }
})
