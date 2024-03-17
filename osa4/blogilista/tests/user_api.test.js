const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const bcrypt = require('bcrypt')
const User = require('../models/user')

beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
})

describe('when one user in database', () => {
    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'test',
            name: 'test',
            password: 'psw',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })
})

describe('adding invalid users', () => {
    test('rejects new user when no username given', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            name: 'test',
            password: 'psw',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes("`username` is required"))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('rejects new user when no password given', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            name: 'test',
            username: 'test',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes("`password` is required"))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('rejects new user with short password', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            name: 'test',
            username: 'test',
            password: 'pw'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes("`password` is shorter than the minimum allowed length (3)"))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('rejects new user with short username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            name: 'test',
            username: 't',
            password: 'password'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes("`username`"))
        assert(result.body.error.includes("is shorter than the minimum allowed length (3)"))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('rejects a dublicate user', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'test',
            name: 'test',
            password: 'psw',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtMiddle = await helper.usersInDb()
        assert.strictEqual(usersAtMiddle.length, usersAtStart.length + 1)

        const usernames = usersAtMiddle.map(u => u.username)
        assert(usernames.includes(newUser.username))

        const dublicate = {
            username: 'test',
            name: 'test',
            password: 'psw',
        }

        const result = await api
            .post('/api/users')
            .send(dublicate)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes("expected `username` to be unique"))

        assert.strictEqual(usersAtEnd.length, usersAtMiddle.length)
    })
})

after(async () => {
    await mongoose.connection.close()
})