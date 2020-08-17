import 'reflect-metadata';
import { Resolver, Query, Mutation } from 'type-graphql';
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
    return service.listCollectiblesPlaylist()
  }
}
