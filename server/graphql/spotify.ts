import 'reflect-metadata';
import { Resolver, Query, Mutation, Ctx, Arg } from 'type-graphql';
import { service } from '../services';
import { Track, SpotifyPlaylist } from '../models';
import { AuthenticationError } from 'apollo-server-express';

@Resolver()
export class SpotifySchema {
  @Mutation(() => String)
  async savePlaylist(
    @Arg(`id`) id: string,
    @Ctx() ctx: { accessToken: string },
  ): Promise<string> {
    if (!ctx.accessToken)
      throw new AuthenticationError(
        `Access token and refresh token have expired. Please login to Spotify again`,
      );
    return service.savePlaylist(id, ctx.accessToken);
  }
  @Query(() => [Track])
  async listCollectiblesPlaylist(): Promise<Track[]> {
    return service.listCollectiblesPlaylist();
  }
  @Query(() => [SpotifyPlaylist])
  async listPlaylists(
    @Ctx() ctx: { accessToken: string },
  ): Promise<SpotifyPlaylist[]> {
    if (!ctx.accessToken)
      throw new AuthenticationError(
        `Access token and refresh token have expired. Please login to Spotify again`,
      );
    return service.listUserPlaylists(ctx.accessToken);
  }
}
