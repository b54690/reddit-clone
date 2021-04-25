import { Post } from "./entities/Post";
import { _prod_ } from "./constants";
import { MikroORM } from "@mikro-orm/core";
import path from 'path';

export default {
    migrations: {
        path: path.join(__dirname, "/migrations"),
        pattern: /^[\w-]+\d+\.[tj]s$/,
        disableForeignKeys: false
    },
    entities: [Post],
    dbName: "reddit-clone",
    type: "postgresql",
    debug: !_prod_,
    // Turn on debuggin when not in production
} as Parameters<typeof MikroORM.init>[0];

// turn object to var, 
// and then append var.type 
// and hover to find which type