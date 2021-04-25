import { MikroORM } from "@mikro-orm/core";
import { _prod_ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer} from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";

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

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [
                HelloResolver,
                PostResolver
            ],
            validate: false
        }),
        context: () => ({ em: orm.em })
        // Context object accessible by all resolvers
    });

    apolloServer.applyMiddleware({ app })
    // Creates a graphql endpoint on express

    app.get('/', (_, res) => {
        res.send("Helllooooo")
    })
    // Test express is running. Send a response from it's home route
    app.listen(4000, () => {
        console.log('server started on localhost:4000')
    })

    // const post = orm.em.create(Post, {title: "my first post"})
    // if (post) {
    //     await orm.em.persistAndFlush(post);
    // }
    // const posts = await orm.em.find(Post, {})
    // console.log(posts, "===posts===")
};

main().catch((err) => {
    console.log(err);
});




