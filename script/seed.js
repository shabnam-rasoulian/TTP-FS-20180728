'use strict'

const db = require('../server/db')
const {User} = require('../server/db/models')

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

  console.log(`seeded ${users.length} users`)
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
