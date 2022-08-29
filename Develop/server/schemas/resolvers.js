const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        //user, users me
        users: async () => {
            return User.find();
        },
        user: async (parent, { username }) => {
            return User.findOne({ username });
        },
        me: async (parent, args, context) => {
            if (context.user) {
              return User.findOne({ _id: context.user._id });
            }
            throw new AuthenticationError('You need to be logged in!');
          },
    },
    Mutation: {
        //addUser, login, saveBook, removeBook
        addUser: async (parent, {username, email, password}) => {
            try {
                const user = await User.create({ username, email, password});
                const token = signToken(user);
                console.log(token);
                console.log(user);
                return {token, user}
                
            } catch {
                throw new AuthenticationError('Something is wrong!')
                // 
            }
        },

        login: async (parent, {email, password}) => {
            const user = await User.findOne({ email: email });

            if (!user) {
                throw new AuthenticationError('Invalid credentials!');
            }

            const checkPassword = await user.isCorrectPassword(password);

            if (!checkPassword) {
                throw new AuthenticationError('Invalid credentials!');
            }

            const token = auth(user);
            return { token, user };
        },



        saveBook: async (parent, {newBook}, context) => {

            if(!context.user) {
                throw new AuthenticationError('You need to be logged in!');
            }

            try {
                const bookUpdate = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$push: {savedBooks: {...newBook}}},
                    {new: true}
                );
                if (!bookUpdate) {
                    throw new AuthenticationError('Could not update user!');
                }
                return  bookUpdate;
            } catch (error) {
                console.log(error);
            }
        },

        removeBook: async (parent, {bookId}, context) => {

            if (!context.user) {
                throw new AuthenticationError('You need to be logged in!');
            }

            try {
                const bookUpdate = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$pull: { savedBooks: {bookId: bookId}}},
                    {new:true}
                );

                if (!bookUpdate) {
                    throw new AuthenticationError('Could not update user!');
                }
                
                return bookUpdate;
            } catch {
                throw new AuthenticationError('Something is wrong!')
            }
        },
    }
}
module.exports = resolvers;