import 'reflect-metadata';
import { Resolver, Query } from 'type-graphql';
import { service } from '../services';
import { Track } from '../models';

@Resolver()
export class SpotifySchema {
  @Query(() => String)
  async getCollectiblesPlaylist(): Promise<string> {
    return service.getCollectiblesPlaylist();
  }
  @Query(() => [Track])
  async listCollectiblesPlaylist(): Promise<Track[]> {
    return service.listCollectiblesPlaylist()
  }
}
