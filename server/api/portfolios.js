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
