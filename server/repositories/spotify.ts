import axios from 'axios';
import { Track, ISpotifyTrack, IBulkWrite, ITrackDocument } from '../models';
import qs from 'qs';
import { CollectiblesModel } from './mongoose';

const baseSpotifyApiUrl = `https://api.spotify.com/v1`;

export const getSpotifyAccessToken = async (): Promise<string> => {
  const data = { grant_type: `client_credentials` };
  const {
    data: { access_token: accessToken },
  } = await axios({
    method: `POST`,
    url: `https://accounts.spotify.com/api/token`,
    data: qs.stringify(data),
    headers: {
      Authorization: `Basic ${process.env.SPOTIFY_AUTH_SECRET}`,
      'content-type': 'application/x-www-form-urlencoded',
    },
  });
  return accessToken;
};

export const listCollectiblesTracks = async (
  accessToken: string,
): Promise<ISpotifyTrack[]> => {
  console.log(`Fetching collectibles tracks...`);
  console.time(`Fetched collectibles tracks in`);
  const collectiblesTracks = await listCollectiblesTracksRecursive(
    `${baseSpotifyApiUrl}/playlists/546C1VqlSpUXRAs0zZQ0jZ/tracks`,
    accessToken,
    [],
  );
  console.timeEnd(`Fetched collectibles tracks in`);
  return collectiblesTracks;
};

const listCollectiblesTracksRecursive = async (
  nextUrl: string,
  accessToken: string,
  previousTracks: ISpotifyTrack[],
): Promise<ISpotifyTrack[]> => {
  const {
    data: { items, next },
  } = await axios({
    method: `GET`,
    url: nextUrl,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const allTracks = [...previousTracks, ...items];

  if (next) {
    return listCollectiblesTracksRecursive(next, accessToken, allTracks);
  } else {
    return allTracks;
  }
};

export const bulkWriteTracksToMongoDB = async (
  tracks: Track[],
): Promise<IBulkWrite> => {
  console.log(`Bulk writing tracks to DB...`);
  console.time(`Bulk wrote tracks in`);

  const bulkWriteQuery = tracks.map((track: Track) => {
    return {
      updateOne: {
        filter: { spotifyId: track.spotifyId },
        update: track,
        upsert: true,
      },
    };
  });
  const {
    upsertedCount,
    matchedCount,
    modifiedCount,
  } = await CollectiblesModel.bulkWrite(bulkWriteQuery);

  console.timeEnd(`Bulk wrote tracks in`);
  return { upsertedCount, matchedCount, modifiedCount };
};

export const listCollectiblesPlaylist = async (): Promise<Track[]> => {
  const collectiblesTracks = (await CollectiblesModel.find({}, null, {
    lean: true,
  })) as ITrackDocument[];
  return collectiblesTracks;
};


