import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { _prod_ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer} from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from "./types";
import cors from "cors";

// 1. Connect to database
// 2. Run migrations
// 3. Create SQL

const main = async () => {
    const orm = await MikroORM.init(microConfig);
    // connects to database
    const migrator = orm.getMigrator();
    await migrator.up();
    // auto run migrations

    const app = express();

    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient();

    app.use(
        cors({
            origin: "http://localhost:3000",
            credentials: true 
        })
    )
    // applies cors to all routes

    app.use(
        session({
            name: 'qid',
            store: new RedisStore({ 
                client: redisClient,
                disableTouch: true,
            }),
            // set graphQl "request.credentials": "include",
            // consider using TTL parameter
            // disable touch, reagrds resaving and restting the TTL
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
                httpOnly: true, // ensure you can't access the cookies in js
                secure: _prod_, // cookie only works in https
                sameSite: 'lax'
            },
            saveUninitialized: false,
            secret: 'thisisarandomsecret',
            resave: false,
        })
    )

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [
                HelloResolver,
                PostResolver, 
                UserResolver,
            ],
            validate: false
        }),
        context: ({ req, res }): MyContext => ({ em: orm.em, req, res })
        // Context object accessible by all resolvers
        // Apollo allows us to access the express req and res objects via the context object
    });

    apolloServer.applyMiddleware({ app, cors: false })
    // Creates a graphql endpoint on express

    app.get('/', (_, res) => {
        res.send("Helllooooo")
    })
    // Test express is running. Send a response from it's home route
    app.listen(4000, () => {
        console.log('server started on localhost:4000')
    })
};

main().catch((err) => {
    console.log(err);
});




