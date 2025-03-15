import express from "express";
import { ApolloServer } from "@apollo/server";
import bodyParser from "body-parser";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";

import { TODOS } from "./todo.js"
import { USERS } from "./user.js"

const startServer = async () => {

    const app = express();


    //     typeDefs: `
    //     type User {
    //         id: ID!
    //         name: String!
    //         username: String!
    //         email: String!
    //         phone: String!
    //         website: String!
    //     }
    //     type Todo {
    //        id: ID!
    //         title: String!
    //         completed: Boolean
    //     }
    //     type Query {
    //          getTodos: [Todo]
    //          getSingleTodo(id: ID!): Todo
    //          getUsers : [User]
    //     }
    //     `,

    //     resolvers: {
    //         Query: {
    //             getTodos: () => TODOS,
    //             getUsers: () => USERS,
    //             getSingleTodo: async (parent, { id }) => TODOS.find((e) => e.id === id),
    //         }
    //     }
    // });
    const server = new ApolloServer({
        typeDefs: `
            type User {
                id: ID!
                name: String!
                username: String!
                email: String!
                phone: String!
                website: String!
            }
    
            type Todo {
                id: ID!
                title: String!
                completed: Boolean
                user: User
            }
    
            type Query {
                getTodos: [Todo]
                getAllUsers: [User]
                getUser(id: ID!): User
            }
    
        `,
        resolvers: {
            Todo: {
                user: (todo) => USERS.find((e) => e.id === todo.id),
            },

            Query: {
                getTodos: () => TODOS,
                getAllUsers: () => USERS,
                getUser: (parent, { id }) => USERS.find((user) => user.id.toString() === id),
            },
        },
    });

    app.use(bodyParser.json());
    app.use(cors());

    await server.start();

    app.use("/graphql", expressMiddleware(server));

    app.listen(8080, () => console.log("Serevr Started at PORT 8080"));
}
startServer()