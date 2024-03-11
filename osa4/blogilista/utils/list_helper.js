const _ = require('lodash')

const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }

    return blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
    let favourite = {}
    let mostLikes = -1
    for (let i = 0; i < blogs.length; i++) {
        const element = blogs[i];
        if (element.likes > mostLikes) {
            mostLikes = element.likes
            favourite = element
        }
    }

    return favourite
}

const mostBlogs = (blogs) => {
    const names = _.map(blogs, (blog) => blog.author)
    const nameFreq = _.countBy(names)
    const best = _.maxBy(_.keys(nameFreq), (name) => nameFreq[name])

    return best
        ? { author: best, blogs: nameFreq[best] }
        : {}
}

const mostLikes = (blogs) => {
    const groupedByAuthor = _.groupBy(blogs, 'author')
    const likesSummed = _.mapValues(groupedByAuthor, group => _.sumBy(group, 'likes'))
    const best = _.maxBy(_.keys(likesSummed), (name) => likesSummed[name])

    return best
        ? { author: best, likes: likesSummed[best] }
        : {}
}

module.exports = {
    dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes
}