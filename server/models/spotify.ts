import { Field, ObjectType } from 'type-graphql';
import { Document } from 'mongoose';

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

export interface ISpotifyTrack {
  track: {
    name: string;
    album: { name: string };
    artists: { name: string }[];
    id: string;
  };
}

export interface ITrackDocument extends Document {
  track: string;
  album: string;
  artists: string[];
  spotifyId: string;
}

export interface IBulkWrite {
  upsertedCount: number;
  modifiedCount: number;
  matchedCount: number;
}
