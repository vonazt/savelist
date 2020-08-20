import { repository } from '../repositories';
import { ISpotifyTrack, SpotifyPlaylist } from '../models';

export const savePlaylist = async (
  id: string,
  accessToken: string,
): Promise<string> => {
  console.log(`Fetching playlist tracks...`);
  console.time(`Fetched playlist tracks in`);
  const playlistTracks = await repository.listPlaylistTracksRecursive(
    `https://api.spotify.com/v1/playlists/${id}/tracks`,
    accessToken,
    [],
  );
  console.timeEnd(`Fetched playlist tracks in`);
  const formattedTracks = playlistTracks.map(
    ({ track: { name, album, artists, id } }: ISpotifyTrack) => ({
      track: name,
      album: album.name,  
      artists: artists.map(({ name }) => name),
      spotifyId: id,
    }),
  );
  return JSON.stringify(formattedTracks);
};

export const listCollectiblesPlaylist = repository.listCollectiblesPlaylist;

export const listUserPlaylists = async (
  accessToken: string,
): Promise<SpotifyPlaylist[]> => {
  console.log(`Fetching user's playlists...`);
  console.time(`Fetched playlists in`);
  const playlists = await repository.listUserPlaylistsRecursive(
    accessToken,
    `https://api.spotify.com/v1/me/playlists`,
    [],
  );
  console.timeEnd(`Fetched playlists in`);
  return playlists;
};
