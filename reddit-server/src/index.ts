import { MikroORM } from "@mikro-orm/core";
import { _prod_ } from "./constants";
import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";

// 1. Connect to database
// 2. Create row in table
// 3. Create SQL

const main = async () => {
    const orm = await MikroORM.init(microConfig);
    // creates an instance of Post
    const migrator = orm.getMigrator();
    await migrator.up();
    // auto run migrations
    const post = orm.em.create(Post, {title: "my first post"})
    // creates post in database
    if (post) {
        await orm.em.persistAndFlush(post);
    }
    // await orm.em.nativeInsert(Post, {title: "my first post 2"})
};

main().catch((err) => {
    console.log(err);
});




