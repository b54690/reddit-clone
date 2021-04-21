import { MikroORM } from "@mikro-orm/core";
import { _prod_ } from "./constants";
import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";

const main = async () => {
    const orm = await MikroORM.init(microConfig);
    // creates an instance of Post
    const post = orm.em.create(Post, {title: 'my first post'})
    // creates post in database
    await orm.em.persistAndFlush(post);
    await orm.em.nativeInsert(Post, {title: "my first post 2"})

};

main().catch((err) => {
    console.log(err);
});




