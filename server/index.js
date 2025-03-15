import express from "express";
import { ApolloServer } from "@apollo/server";
import bodyParser from "body-parser";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";
import morgan from "morgan"
import cookieParser from "cookie-parser";

import { TODOS } from "./todo.js"
import { USERS } from "./user.js"

const startServer = async () => {

    const app = express();
    app.use(morgan("dev"));
    app.use(cookieParser());

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
    app.use(cors({
        origin: "http://localhost:3000",
        credentials: true,
    }));

    await server.start();

    app.use("/graphql", expressMiddleware(server));
    app.use(express.json())

    app.listen(8080, () => console.log("Serevr Started at PORT 8080"));
}
startServer()