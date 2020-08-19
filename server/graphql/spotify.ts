import 'reflect-metadata';
import { Resolver, Query, Mutation, Ctx } from 'type-graphql';
import { service } from '../services';
import { Track, SpotifyPlaylist } from '../models';

@Resolver()
export class SpotifySchema {
  @Mutation(() => String)
  async saveCollectiblesPlaylist(): Promise<string> {
    return service.saveCollectiblesPlaylist();
  }
  @Query(() => [Track])
  async listCollectiblesPlaylist(): Promise<Track[]> {
    return service.listCollectiblesPlaylist();
  }
  @Query(() => [SpotifyPlaylist])
  async listPlaylists(@Ctx() ctx: { accessToken: string }): Promise<SpotifyPlaylist[]> {
    return service.listUserPlaylists(ctx.accessToken)
  }
}
