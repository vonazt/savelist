import { repository } from '../repositories';
import { ISpotifyTrack } from '../models';
import fs from 'fs';

export const saveCollectiblesPlaylist = async (): Promise<string> => {
  const spotifyAccessToken = await repository.getSpotifyAccessToken();
  const collectiblesTracks = await repository.listCollectiblesTracks(
    spotifyAccessToken,
  );
  const formattedTracks = collectiblesTracks.map(
    ({ track: { name, album, artists, id } }: ISpotifyTrack) => ({
      track: name,
      album: album.name,
      artists: artists.map(({ name }) => name),
      spotifyId: id,
    }),
  );
  fs.writeFileSync(`./collectibles.json`, JSON.stringify(formattedTracks));
  const {
    upsertedCount,
    modifiedCount,
    matchedCount,
  } = await repository.bulkWriteTracksToMongoDB(formattedTracks);
  return `Upserted ${upsertedCount} tracks, modified ${modifiedCount} tracks, matched ${matchedCount} tracks`;
};

export const listCollectiblesPlaylist = repository.listCollectiblesPlaylist;

export const listUserPlaylists = async (accessToken: string) => {
  console.log(`Fetching user's playlists...`)
  console.time(`Fetched playlists in`)
  const playlists = await repository.listUserPlaylistsRecursive(
    accessToken,
    `https://api.spotify.com/v1/me/playlists`,
    []
  );
  console.timeEnd(`Fetched playlists in`)
  // console.log('playlists are', playlists)
};
