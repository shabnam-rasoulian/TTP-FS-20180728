const router = require('express').Router()
module.exports = router

router.use('/portfolios', require('./portfolios'))
router.use('/transactions', require('./transactions'))
router.use('/users', require('./users'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
