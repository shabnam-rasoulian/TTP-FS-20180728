'use strict'

const db = require('../server/db')
const {Transaction, User} = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const users = await Promise.all([
    User.create({
      name: 'Shabnam',
      email: 'shabnam@gmail.com',
      password: 'shabnam123'
    }),
    User.create({
      name: 'Sarah',
      email: 'sarah@gmail.com',
      password: 'sarah123'
    }),
    User.create({name: 'Jack', email: 'jack@gmail.com', password: 'jack123'})
  ])

  const transactions = await Promise.all([
    Transaction.create({
      ticker: 'GE',
      quantity: 100,
      tradeType: 'buy',
      price: 7.8,
      userId: 1
    }),
    Transaction.create({
      ticker: 'SNAP',
      quantity: 100,
      tradeType: 'buy',
      price: 6.35,
      userId: 1
    }),
    Transaction.create({
      ticker: 'MSFT',
      quantity: 10,
      tradeType: 'buy',
      price: 103.11,
      userId: 1
    }),
    Transaction.create({
      ticker: 'FB',
      quantity: 10,
      tradeType: 'buy',
      price: 136.7,
      userId: 2
    }),
    Transaction.create({
      ticker: 'GE',
      quantity: 100,
      tradeType: 'buy',
      price: 7.8,
      userId: 2
    })
  ])

  await Promise.all([
    User.update({balance: 4316.5}, {where: {id: 1}, returning: true}),
    User.update({balance: 2853}, {where: {id: 2}, returning: true})
  ])

  console.log(`seeded ${users.length} users`)
  console.log(`seeded ${transactions.length} transactions`)
  console.log(`seeded successfully`)
}

async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

if (module === require.main) {
  runSeed()
}

module.exports = seed
