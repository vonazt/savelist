import axios from 'axios';
import {
  Track,
  ISpotifyTrack,
  IBulkWrite,
  ITrackDocument,
  SpotifyPlaylist,
} from '../models';
import qs from 'qs';
import { CollectiblesModel, TokensModel } from './mongoose';

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

export const listUserPlaylistsRecursive = async (
  accessToken: string,
  url: string,
  prevPlaylists: SpotifyPlaylist[],
): Promise<SpotifyPlaylist[]> => {
  const response = await axios({
    method: `GET`,
    url,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const allPlaylists = [...prevPlaylists, ...response.data.items];

  if (response.data.next) {
    return listUserPlaylistsRecursive(
      accessToken,
      response.data.next,
      allPlaylists,
    );
  } else {
    return allPlaylists;
  }
};

export const validateToken = async (accessToken: string): Promise<string> => {
  try {
    await axios({
      method: `GET`,
      url: `${baseSpotifyApiUrl}/me`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(`access token still valid`);
    return accessToken;
  } catch (err) {
    console.error(`invalid token with status: `, err.response.status);
    if (err.response.status === 401) {
      try {
        console.log('attempting to refresh token');
        const refreshToken = await getRefreshToken(accessToken);
        const newAccessToken = await doRefreshToken(refreshToken);
        await updateAccessToken(refreshToken, accessToken);
        return newAccessToken;
      } catch (err) {
        console.error(
          `refresh token invalid with status: `,
          err.response.status,
        );
        await deleteTokens(accessToken);
        return null;
      }
    }
  }
};

const doRefreshToken = async (refresh_token: string): Promise<string> => {
  const data = {
    refresh_token,
    grant_type: 'refresh_token',
  };

  const {
    data: { access_token },
  } = await axios({
    method: `POST`,
    url: `https://accounts.spotify.com/api/token`,
    data: qs.stringify(data),
    headers: {
      Authorization: `Basic ${process.env.SPOTIFY_AUTH_SECRET}`,
      'content-type': 'application/x-www-form-urlencoded',
    },
  });

  console.log('generated fresh access token', access_token);

  return access_token;
};

export const saveTokens = async (
  accessToken: string,
  refreshToken: string,
): Promise<void> => {
  console.log('saving tokens');
  const tokensToSave = new TokensModel({ accessToken, refreshToken });
  tokensToSave.save();
};

export const getRefreshToken = async (accessToken: string): Promise<string> => {
  console.log('getting refresh token');
  const { refreshToken } = await TokensModel.findOne({ accessToken }, null, {
    lean: true,
  });
  return refreshToken;
};

export const updateAccessToken = async (
  accessToken: string,
  refreshToken: string,
): Promise<void> => {
  console.log('Updating access token');
  TokensModel.findOneAndUpdate({ refreshToken }, { accessToken });
};

export const deleteTokens = async (accessToken: string): Promise<void> => {
  console.log('deleting tokens');
  TokensModel.findOneAndDelete({ accessToken });
};
