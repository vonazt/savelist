import { InputType, Field, ObjectType, ArgsType } from 'type-graphql';

@InputType(`NewBaby`)
@ObjectType(`Baby`)
@ArgsType()
export class Baby {
  @Field()
  name: string;

  @Field()
  weight: number;

  @Field()
  dob: Date;

  @Field()
  height: number
}
