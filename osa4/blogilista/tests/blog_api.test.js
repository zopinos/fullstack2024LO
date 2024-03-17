const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash(helper.initialUser.password, 10)
    const user = new User({
        name: helper.initialUser.name,
        username: helper.initialUser.username,
        passwordHash
    })

    await user.save()

    const blogObjects = helper.initialBlogs.map((blog) => {
        blog.user = user
        return new Blog(blog)
    })
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

describe('when blogs in database', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('there are six blogs', async () => {
        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('returned blogs have property id', async () => {
        const response = await api.get('/api/blogs')

        assert.strictEqual(
            response.body.every((e) => e.hasOwnProperty('id')),
            true)
    })

    test('returned blogs have userId property user', async () => {
        const response = await api.get('/api/blogs')

        assert.strictEqual(
            response.body.every((e) => e.hasOwnProperty('user')),
            true)
    })
})

describe('adding a blog', () => {
    test('a valid blog can be added', async () => {
        const newBlog = {
            title: "Paras blogi",
            author: "Pekka",
            url: "nettisivublogille",
            likes: 2,
        }

        const tokenRequest = await api
            .post('/api/login')
            .send(helper.initialUser)
            .expect(200)

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${tokenRequest.body.token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

        const titles = response.body.map(b => b.title)
        assert(titles.includes(newBlog.title))
    })

    test('empty likes will set the value to zero (0)', async () => {
        const newBlog = {
            title: "No likes blog",
            author: "Pekka",
            url: "toinennettisivublogille"
        }

        const tokenRequest = await api
            .post('/api/login')
            .send(helper.initialUser)
            .expect(200)

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${tokenRequest.body.token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')

        const last = response.body[response.body.length - 1]

        assert.strictEqual(last.likes, 0)
    })

    test('invalid blog posts will respond with status code 400', async () => {
        const tokenRequest = await api
            .post('/api/login')
            .send(helper.initialUser)
            .expect(200)

        const invalidBlog1 = {
            author: "Pekka",
        }

        await api
            .post('/api/blogs')
            .send(invalidBlog1)
            .set('Authorization', `Bearer ${tokenRequest.body.token}`)
            .expect(400)

        const invalidBlog2 = {
            title: "Invalid Blog 2",
            author: "Pekka",
        }

        await api
            .post('/api/blogs')
            .send(invalidBlog2)
            .set('Authorization', `Bearer ${tokenRequest.body.token}`)
            .expect(400)

        const invalidBlog3 = {
            author: "Pekka",
            url: "invalidblog3"
        }

        await api
            .post('/api/blogs')
            .send(invalidBlog3)
            .set('Authorization', `Bearer ${tokenRequest.body.token}`)
            .expect(400)

        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('a valid blog cannot be added if token is not given', async () => {
        const newBlog = {
            title: "Paras blogi",
            author: "Pekka",
            url: "nettisivublogille",
            likes: 2,
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, helper.initialBlogs.length)

        const titles = response.body.map(b => b.title)
        assert(!titles.includes(newBlog.title))
    })
})

describe('deletion and updating blogs', () => {
    test('deletion succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        const tokenRequest = await api
            .post('/api/login')
            .send(helper.initialUser)
            .expect(200)

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${tokenRequest.body.token}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

        const ids = blogsAtEnd.map(b => b.id)
        assert(!ids.includes(blogToDelete.ids))
    })

    test('modification of a blog succeeds', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        const changes = { ...blogToUpdate }
        changes.likes += 5

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(changes)

        const blogsAtEnd = await helper.blogsInDb()
        const blogUpdated = blogsAtEnd[0]

        assert.notDeepStrictEqual(blogUpdated, blogToUpdate)

        assert.deepStrictEqual(blogUpdated, changes)
    })
})

after(async () => {
    await mongoose.connection.close()
})