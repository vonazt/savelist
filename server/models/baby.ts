import { InputType, Field, ObjectType } from 'type-graphql';

@InputType(`NewBaby`)
@ObjectType(`Baby`)
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
