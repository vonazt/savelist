import { InputType, Field, ObjectType, ArgsType } from 'type-graphql';

@InputType(`NewData`)
@ObjectType(`Data`)
@ArgsType()
export class Data {
  @Field()
  name: string;

  @Field()
  age: number;

  @Field({ nullable: true })
  _id: string;
}

@InputType(`UpdateData`)
@ArgsType()
export class UpdateData {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  age: number;
}
