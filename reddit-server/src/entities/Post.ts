import { PrimaryKey, Property, Entity } from "@mikro-orm/core";
import { ObjectType, Field } from "type-graphql";

// Graphql requires:
// - ObjectType
// - Field + type declarations

@Entity()
@ObjectType()
export class Post {

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
    @Property({ type: 'text'})
    title!: string;
}