const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        //user, users me
    },
    Mutation: {
        //addUser, login, saveBook, removeBook
    }
}