export type ExternalUrls = {
  spotify: string;
};

export type SpotiftyImage = {
  height: number;
  url: string;
  width: number;
};

export type SpotifyOwner = {
  display_name: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  type: string;
  uri: string;
};

export type SpotifyPlaylistTracks = {
  href: string;
  total: number;
};

export type SpotifyPlaylist = {
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: SpotiftyImage[];
  name: string;
  owner: SpotifyOwner;
  primary_color: string;
  public: boolean;
  snapshot_id: string;
  tracks: SpotifyPlaylistTracks;
  type: string;
  uri: string;
};

export type SpotifyPlaylistQuery = {
  listPlaylists: SpotifyPlaylist[];
};

export type FormattedPlaylist = {
  track: string;
  album: string;
  artists: string[];
  spotifyId: string;
};

export type CurrentlySaving = {
  [key: string]: { isSaving: boolean; name: string };
};

export type SavedPlaylist = {
  savePlaylist: string;
};