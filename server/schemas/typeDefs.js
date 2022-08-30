const { gql } = require('apollo-server-express');

// Query, Mutatio, User, Book, Auth
const typeDefs = gql`
type Query {
    users: [User]
    me: User
}

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(newBook: saveBookContent!): User
    removeBook(bookId: String!): User
}

input saveBookContent {
    authors: [String]
    description: String
    title: String!
    bookId: String!
    image: String
    link: String
}

type User{
    _id: ID!
    username: String
    email: String
    password: String
    bookCount: String
    savedBooks: [Book]
}

type Book {
    bookId: String!
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String
}

type Auth {
    token: ID!
    user: User
}
`
module.exports = typeDefs;