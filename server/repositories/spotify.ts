import axios from 'axios';
import { Track, ISpotifyTrack, IBulkWrite, ITrackDocument } from '../models';
import qs from 'qs';
import { CollectiblesModel } from './mongoose';
import { repository } from '../repositories';

const baseSpotifyApiUrl = `https://api.spotify.com/v1`;

interface ISpotifyPlaylist {
  collaborative: boolean;
  description: string;
  external_urls: { [key: string]: string };
  href: string;
  id: string;
  images: ISpotiftyImage[];
  name: string;
  owner: ISpotifyOwner;
  primary_color: string;
  public: boolean;
  snapshot_id: string;
  tracks: ISpotifyPlaylistTracks;
  type: string;
  uri: string;
}

interface ISpotiftyImage {
  height: number;
  url: string;
  width: number;
}

interface ISpotifyOwner {
  display_name: string;
  external_urls: { [key: string]: string };
  href: string;
  id: string;
  type: string;
  uri: string;
}

interface ISpotifyPlaylistTracks {
  href: string;
  total: number;
}

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
  prevPlaylists: ISpotifyPlaylist[],
): Promise<ISpotifyPlaylist[]> => {
  console.log('here');
  const response = await axios({
    method: `GET`,
    url,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  // console.log('going round, next is', response.data.next);
  // console.log('response is', response);
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

export const validateToken = async (accessToken: string, refreshToken: string) => {
  console.log('FRERERE', refreshToken)
  try {
    const response = await axios({
      method: `GET`,
      url: `${baseSpotifyApiUrl}/me`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    // console.log('response is', status);
  } catch (err) {
    console.error(`ASJHASJAHSerror is`, err.response.status);
    if (err.response.status === 401) {
      try {
        console.log('in try')
        const accessToken = await doRefreshToken(refreshToken)
      } catch(err) {
        console.error(err)
        // return false
      }
    }
  }
};

const doRefreshToken = async (refresh_token: string): Promise<string> => {
  const data = {
    refresh_token: `ajshajsh`,
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

  console.log('access token', access_token)

  return access_token
}
