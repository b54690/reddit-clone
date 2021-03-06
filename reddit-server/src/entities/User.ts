import { PrimaryKey, Property, Entity } from "@mikro-orm/core";
import { ObjectType, Field } from "type-graphql";

@Entity()
@ObjectType()
export class User {

    @Field()
    @PrimaryKey()
    id!: number;

    @Field(() => String)
    @Property({ type: 'date'})
    createdAt = new Date();

    @Field(() => String)
    @Property({ type: 'date', onUpdate: () => new Date() })
    updatedAt = new Date();

    @Field()
    @Property({ type: 'text', unique: true })
    username!: string;

    @Field()
    @Property({ type: 'text', unique: true })
    email!: string;

    @Property({ type: 'text'})
    password!: string;
}
