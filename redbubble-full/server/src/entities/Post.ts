import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Post {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field(() => Date)
  @Property({ type: "date", default: "NOW()" })
  createdAt? = new Date();

  @Field(() => Date)
  @Property({ type: "date", default: "NOW()", onUpdate: () => new Date() })
  updatedAt? = new Date();

  @Field(() => Date, { nullable: true})
  @Property({ type: "date", onUpdate: () => new Date() })
  deleteAt? = new Date();

  @Field()
  @Property({ type: "text" })
  title!: string;
}
