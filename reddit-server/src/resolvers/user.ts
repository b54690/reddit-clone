import { Resolver, Mutation, Arg, InputType, Field, Ctx, ObjectType } from "type-graphql";
import { MyContext } from "src/types";
import { User } from "src/entities/User";
import argon2 from "argon2";

@ObjectType()
class UserResponse {
    @Field()
}

@ObjectType()



@InputType()
class UsernamePasswordInput {
    @Field()
    username: string
    @Field()
    password: string
}

@Resolver()
export class UserResolver {

    @Mutation(() => User)
    async createUser(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() {em}: MyContext
    ): Promise<User> {
        const hashedPassword = await argon2.hash(options.password);
        const user = em.create(User, {username: options.username, password: hashedPassword});
        await em.persistAndFlush(user);
        return user;
    }
}