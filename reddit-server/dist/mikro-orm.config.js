"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Post_1 = require("./entities/Post");
const User_1 = require("./entities/User");
const constants_1 = require("./constants");
const path_1 = __importDefault(require("path"));
exports.default = {
    migrations: {
        path: path_1.default.join(__dirname, "/migrations"),
        pattern: /^[\w-]+\d+\.[tj]s$/,
        disableForeignKeys: false
    },
    entities: [Post_1.Post, User_1.User],
    dbName: "reddit-clone",
    type: "postgresql",
    debug: !constants_1._prod_,
};
//# sourceMappingURL=mikro-orm.config.js.map