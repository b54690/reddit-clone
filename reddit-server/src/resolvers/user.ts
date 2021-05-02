import { Resolver, Mutation, Arg, InputType, Field, Ctx, ObjectType } from "type-graphql";
import { MyContext } from "src/types";
import { User } from "../entities/User";
import argon2 from "argon2";

// ObjectTypes get returned
@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[];

    @Field(() => User, {nullable: true})
    user?: User;
}

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string;
    @Field()
    password: string;
}

@Resolver()
export class UserResolver {

    @Mutation(() => UserResponse)
    async createUser(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() {em}: MyContext
    ): Promise<UserResponse> {
        if (options.username.length <= 2) {
            return {
                errors: [{
                    field: "username",
                    message: "length must be 2 or more characters"
                }]
            };
        }
        if (options.password.length <= 2) {
            return {
                errors: [{
                    field: 'password',
                    message: "password must be 2 or more characters"
                }]
            };
        }
        const hashedPassword = await argon2.hash(options.password);
        const user = em.create(User, {username: options.username, password: hashedPassword});

        try {
            await em.persistAndFlush(user);
        } catch(err) {
            // duplicate username error
            if (err.code === '23505' || err.detail.includes("already exists")) {
                return {
                    errors: [{
                        field: "username",
                        message: "username already exists"
                    }]
                }
            };
        }

        return {user};
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() { em }: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, {username: options.username});
        if (!user) {
            return {
                errors: [{
                    field: "Username",
                    message: "Username doesn't exist"
                }]
            };
        }
        const valid = await argon2.verify(user.password, options.password)
        if (!valid) {
            return {
                errors: [{
                    field: "password",
                    message: "incorrect password"
                }]
            }
        }
        return {user};
    }
}