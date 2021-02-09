import {ApolloServer, gql, UserInputError} from 'apollo-server'
import {importSchema} from "graphql-import";
import {v1 as uuid} from 'uuid'
import mongoose from "mongoose"
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()
import Author from "./models/author.js";
import Book from "./models/book.js";
import User from "./models/user.js";
import resolvers from "./resolvers.js";

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('debug', true)

mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log("connected to mongo db url=", process.env.DB_URL)
    })
    .catch(e => {
        console.log("error connecting to mongo db: ", e.message)
    })

const typeDefs = importSchema('./schema.graphql')


const server = new ApolloServer(
    {
        typeDefs,
        resolvers,
        debug: true,
        context: async ({req}) => {
            // get the token from the request object
            const auth = req && req.headers ? req.headers.authorization : null  // my bug was to access headers when they were undefined

            if (auth && auth.toLowerCase().startsWith('bearer ')) {
                // returns obj the token was based on {username, id}
                const decodedtoken = jwt.verify(auth.substring(7), process.env.SECRET)

                const currentUser = await User.findById(decodedtoken.id)

                return {
                    currentUser
                }
            }
        }
    })

server.listen()
    .then(({url, subscriptionsUrl}) =>
        console.log(`Server ready at ${url}
Subscriptions ready at ${subscriptionsUrl}`))


