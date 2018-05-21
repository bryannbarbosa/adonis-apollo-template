const { GraphQLString, GraphQLID, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLInt } = require('graphql')
const _ = require('lodash')

const books = [
    { id: '1', name: 'Harry Potter', genre: 'Fiction', authorId: '1' },
    { id: '2', name: 'Little Prince', genre: 'History', authorId: '2' },
    { id: '3', name: 'Origin of species', genre: 'Biology', authorId: '3' }
]

const authors = [
    { id: '1', name: 'J.K Rowling', age: 40 },
    { id: '2', name: 'Antoine de Saint-Exupéry', age: 200 },
    { id: '3', name: 'Charles Darwin', age: 300 }
]

const BookType = new GraphQLObjectType({
    name: 'BookType',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(root, args) {
                return _.find(authors, { id: root.authorId} )
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'AuthorType',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: GraphQLList(BookType),
            resolve(root, args) {
                return _.filter(books, { authorId: root.id })
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: () => ({
        book: {
            type: BookType,
            args: {
                id: { type: GraphQLID }
            },
            resolve (root, args) {
                return _.find(books, { id: args.id })
            }
        },
        books: {
            type: GraphQLList(BookType),
            resolve(root, args) {
                return books;
            }
        },
        author: {
            type: AuthorType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(root, args) {
                return _.find(authors, { id: args.id })
            }
        },
        authors: {
            type: GraphQLList(AuthorType),
            resolve(root, args) {
                return authors
            }
        }
    })
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        insertAuthor: {
            type: AuthorType,
            args: {
                name: { type: GraphQLString },
                age: { type: GraphQLInt }
            },
            resolve(root, args) {
                const author = { name: args.name, age: args.age }
                authors.push(author)
                return author
            }
        }
    })
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})