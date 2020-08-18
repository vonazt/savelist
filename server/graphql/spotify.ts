import 'reflect-metadata';
import { Resolver, Query, Mutation, Ctx } from 'type-graphql';
import { service } from '../services';
import { Track } from '../models';

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
  @Query(() => String)
  async listPlaylists(@Ctx() ctx: { accessToken: string }): Promise<string> {
    console.log('acess goken is', ctx.accessToken)
    return service.listUserPlaylists(ctx.accessToken)
  }
}
