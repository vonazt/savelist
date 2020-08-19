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

@ObjectType()
class ExternalUrls {
  @Field()
  spotify: string;
}

@ObjectType()
class SpotiftyImage {
  @Field({ nullable: true })
  height: number;
  @Field()
  url: string;
  @Field({ nullable: true })
  width: number;
}

@ObjectType()
class SpotifyOwner {
  @Field()
  display_name: string;
  @Field(() => ExternalUrls)
  external_urls: ExternalUrls;
  @Field()
  href: string;
  @Field()
  id: string;
  @Field()
  type: string;
  @Field()
  uri: string;
}

@ObjectType()
class SpotifyPlaylistTracks {
  @Field()
  href: string;
  @Field()
  total: number;
}

@ObjectType()
export class SpotifyPlaylist {
  @Field()
  collaborative: boolean;
  @Field()
  description: string;
  @Field(() => ExternalUrls)
  external_urls: ExternalUrls;
  @Field()
  href: string;
  @Field()
  id: string;
  @Field(() => [SpotiftyImage])
  images: SpotiftyImage[];
  @Field()
  name: string;
  @Field()
  owner: SpotifyOwner;
  @Field()
  primary_color: string;
  @Field()
  public: boolean;
  @Field()
  snapshot_id: string;
  @Field(() => SpotifyPlaylistTracks)
  tracks: SpotifyPlaylistTracks;
  @Field()
  type: string;
  @Field()
  uri: string;
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
