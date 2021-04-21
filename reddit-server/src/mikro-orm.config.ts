import { Post } from "./entities/Post";
import { _prod_ } from "./constants";
import { MikroORM } from "@mikro-orm/core";

export default {
    entities: [Post],
    dbName: "reddit-clone",
    type: "postgresql",
    debug: !_prod_,
    // Turn on debuggin when not in production
} as Parameters<typeof MikroORM.init>[0];

// turn object to var, 
// and then append var.type 
// and hover to find which type