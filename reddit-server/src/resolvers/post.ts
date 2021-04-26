import { Query, Resolver, Ctx, Arg, Int, Mutation } from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext } from "src/types";

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    // Set the Graphql type
    posts(@Ctx() {em}: MyContext): Promise<Post[]> {
        // set the Typescript type
        return em.find(Post, {})
    }

    @Query(() => Post, { nullable: true })
    post(
        @Arg("id", () => Int) id: number,
        @Ctx() {em}: MyContext
        ): Promise<Post | null> {
        return em.findOne(Post, {id})
    }

    @Mutation(() => Post)
    async createPost(
        @Arg("title") title: string,
        @Ctx() {em}: MyContext
    ): Promise<Post> {
        const post = em.create(Post, {title});
        await em.persistAndFlush(post);
        return post;
    }

    @Mutation(() => Post)
    async updatePost(
        @Arg("title", () => String, {nullable: true}) title: string,
        @Arg("id") id: number,
        @Ctx() {em}: MyContext
    ): Promise<Post | null> {
        const post = await em.findOne(Post, {id});
        if (!post) {
            return null;
        }
        if (typeof post !== 'undefined') {
            post.title = title;
            await em.persistAndFlush(post);
        }
        return post
    }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg("id") id: number, 
        @Ctx() {em}: MyContext
    ): Promise<boolean> {
        try {
            await em.nativeDelete(Post, {id});
        } catch {
            return false;
        }
        return true;
    }
}
