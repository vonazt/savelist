import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Track {
  @Field()
  track: string;

  @Field()
  album: string;

  @Field(() => [String])
  artists: string[];

  @Field({ nullable: true })
  spotifyId: string;
}
