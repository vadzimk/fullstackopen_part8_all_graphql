import Book from "./models/book.js";
import Author from "./models/author.js";
import {AuthenticationError, UserInputError, PubSub} from "apollo-server";
import User from './models/user.js'
import jwt from 'jsonwebtoken'

const pubsub = new PubSub()

const resolvers = {
    Query: {
        bookCount: () => Book.collection.countDocuments(),

        authorCount: () => Author.collection.countDocuments(),

        allBooks: async (root, args) => {

            let result = await Book.find({}).populate('author')
            if (args.author) {
                const foundAuthorByName = await Author.findOne({name: args.author})
                try {
                    result = await Book.find({author: foundAuthorByName._id}).populate('author')
                } catch (e) {
                    throw new UserInputError(e.message, {invalidArgs: args})
                }

            }
            if (args.genre) {
                result = result.filter(b => b.genres.includes(args.genre))
            }
            return result
        },

        allAuthors: async (root, args, context, info) => {
            // console.log("info", info.operation.selectionSet.selections[0].selectionSet.selections)
            const authors = await Author.find({})
            return authors
        },
        me: (root, args, context) => context.currentUser  // logged in user, if there is no user connected to the request the value of currentUser==undefined
    },

    // Author: {
    //     bookCount: async (root) => {  // root is a parent object which is Author
    //
    //         let numberBooks
    //         try {
    //             numberBooks = await Book.collection.countDocuments({author: root._id})
    //         } catch (e) {
    //             console.log("err form book count", e.message)
    //         }
    //
    //         return numberBooks
    //
    //     }
    // },

    Mutation: {
        addBook: async (root, args, context) => {  // only logged in user
            if (!context.currentUser) {
                throw new AuthenticationError("not authenticated")
            }
            let authorId = null
            const foundAuthor = await Author.findOne({name: args.author})
            if (!foundAuthor) {
                const author = new Author({name: args.author})
                try {
                    const seavedAuthor = await author.save()
                    authorId = seavedAuthor._id
                } catch (e) {
                    console.log("failed to save author")
                    throw new UserInputError(e.message, {invalidArgs: args})
                }
            } else {
                authorId = foundAuthor._id
            }
            const newBook = new Book(
                {
                    ...args,
                    author: authorId,
                    published: parseInt(args.published)
                }
            )


            try {
                await newBook.save()
                const updatedAuthor = await Author.findByIdAndUpdate(authorId, {$inc: {bookCount: 1}}, {new: true})

            } catch (e) {
                console.log("failed to save new book")
                throw new UserInputError(e.message, {invalidArgs: args})
            }


            const addedBook = await newBook.populate('author').execPopulate()
            pubsub.publish('BOOK_ADDED', {bookAdded: addedBook})

            return addedBook
        },

        editAuthor: async (root, args, context) => { // only logged in user
            if (!context.currentUser) {
                throw new AuthenticationError("not authenticated")
            }

            let foundAuthor
            try {
                foundAuthor = await Author.findOne({name: args.name})
            } catch (e) {
                console.log("error from editAuthor findOne", e.message)
            }

            if (!foundAuthor) {
                throw new UserInputError("Name not found", {invalidArgs: args.name})
            }
            foundAuthor.born = parseInt(args.setBornTo)
            return await foundAuthor.save()

        },

        createUser: (root, args) => {
            const user = new User({username: args.username, favoriteGenre: args.favoriteGenre})
            return user.save().catch(e => {
                throw new UserInputError(e.message, {invalidArgs: args})

            })
        },

        login: async (root, args) => {
            const user = await User.findOne({username: args.username})
            if (!user || args.password !== 'secred') {
                throw new AuthenticationError("not authenticated")
            }

            return {
                value: jwt.sign({username: user.username, id: user._id}, process.env.SECRET)
            }
        }
    },

    Subscription: {
        bookAdded: {
            subscribe: () => {

                return pubsub.asyncIterator(['BOOK_ADDED'])
            }
        }
    }
}

export default resolvers