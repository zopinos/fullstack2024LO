const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

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

test('returned blogs have propery id', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(
        response.body.every((e) => e.hasOwnProperty('id')),
        true)
})

test('a valid blog can be added ', async () => {
    const newBlog = {
        title: "Paras blogi",
        author: "Pekka",
        url: "nettisivublogille",
        likes: 2,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

    const last = response.body[response.body.length - 1]
    delete last.id

    assert.deepStrictEqual(last, newBlog)
})

test('empty likes will set the value to zero (0)', async () => {
    const newBlog = {
        title: "No likes blog",
        author: "Pekka",
        url: "toinennettisivublogille"
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const last = response.body[response.body.length - 1]

    assert.strictEqual(last.likes, 0)
})

test('invalid blog posts will respond with status code 400', async () => {
    const invalidBlog1 = {
        author: "Pekka",
    }

    await api
        .post('/api/blogs')
        .send(invalidBlog1)
        .expect(400)

    const invalidBlog2 = {
        title: "Invalid Blog 2",
        author: "Pekka",
    }

    await api
        .post('/api/blogs')
        .send(invalidBlog2)
        .expect(400)

    const invalidBlog3 = {
        author: "Pekka",
        url: "invalidblog3"
    }

    await api
        .post('/api/blogs')
        .send(invalidBlog3)
        .expect(400)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('deletion succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
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

after(async () => {
    await mongoose.connection.close()
})