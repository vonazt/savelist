import axios, { AxiosRequestConfig } from 'axios';
import {
  Track,
  ISpotifyTrack,
  ITrackDocument,
  SpotifyPlaylist,
} from '../models';
import qs from 'qs';
import { CollectiblesModel, TokensModel } from './mongoose';

const baseSpotifyApiUrl = `https://api.spotify.com/v1`;

const getSpotifyTokenApiRequestConfig = (data: {
  [key: string]: string;
}): AxiosRequestConfig => ({
  method: `POST`,
  url: `https://accounts.spotify.com/api/token`,
  data: qs.stringify(data),
  headers: {
    Authorization: `Basic ${process.env.SPOTIFY_AUTH_SECRET}`,
    'content-type': 'application/x-www-form-urlencoded',
  },
});

export const getSpotifyAccessToken = async (): Promise<string> => {
  const data = { grant_type: `client_credentials` };
  const {
    data: { access_token: accessToken },
  } = await axios(getSpotifyTokenApiRequestConfig(data));
  return accessToken;
};

export const listPlaylistTracksRecursive = async (
  nextUrl: string,
  accessToken: string,
  previousTracks: ISpotifyTrack[]
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
    return listPlaylistTracksRecursive(next, accessToken, allTracks);
  } else {
    return allTracks;
  }
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
  const {
    data: { items, next },
  } = await axios({
    method: `GET`,
    url,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const allPlaylists = [...prevPlaylists, ...items];

  if (next) {
    return listUserPlaylistsRecursive(accessToken, next, allPlaylists);
  } else {
    return allPlaylists;
  }
};

export const validateToken = async (accessToken: string): Promise<string> => {
  if (!accessToken) return null;
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
    if ([400, 401].includes(err.response.status)) {
      try {
        console.log('attempting to refresh token');
        const refreshToken = await getRefreshToken(accessToken);
        const newAccessToken = await doRefreshToken(refreshToken);
        await updateAccessToken(refreshToken, newAccessToken);
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
  } = await axios(getSpotifyTokenApiRequestConfig(data));

  console.log('generated fresh access token', access_token);

  return access_token;
};

export const saveTokens = async (
  accessToken: string,
  refreshToken: string,
): Promise<void> => {
  console.log('saving tokens');
  const tokensToSave = new TokensModel({ accessToken, refreshToken });
  await tokensToSave.save();
};

export const getRefreshToken = async (accessToken: string): Promise<string> => {
  console.log('getting refresh token', accessToken);
  const { refreshToken } = await TokensModel.findOne({ accessToken }, null, {
    lean: true,
  });
  if (!refreshToken)
    throw new Error(`Refresh token not found for access token`);
  return refreshToken;
};

export const updateAccessToken = async (
  refreshToken: string,
  accessToken: string,
): Promise<void> => {
  console.log('Updating access token with refresh token');
  await TokensModel.findOneAndUpdate(
    { refreshToken },
    { accessToken },
    { useFindAndModify: false },
  );
};

export const deleteTokens = async (accessToken: string): Promise<void> => {
  console.log('deleting tokens');
  await TokensModel.findOneAndDelete({ accessToken });
};
