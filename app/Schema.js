'use strict'

/*
|--------------------------------------------------------------------------
| GraphQL Schema
|--------------------------------------------------------------------------
|
| A GraphQL Schema is in essence the definition of a type system how the data available to you client is related
| and what queries can be made to retrieve it.
|
| A complete guide on schema is available here.
| https://graphql.org/learn/schema/
|
*/

const { GraphQLString, GraphQLID, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLInt } = require('graphql')
const _ = require('lodash')

const books = [
    { id: '1', name: 'Introduction to Mathematical Philosophy', genre: 'Philosophy', authorId: '1' },
    { id: '2', name: 'The Continuum', genre: 'Mathematics', authorId: '2' },
    { id: '3', name: 'The Foundations Of Geometry', genre: 'Mathematics', authorId: '3' }
]

const authors = [
    { id: '1', name: 'Bertrand Russell', profession: 'Philosopher' },
    { id: '2', name: 'Georg Cantor', profession: 'Mathematician' },
    { id: '3', name: 'David Hilbert', profession: 'Mathematician' }
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