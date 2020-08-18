import { gql } from "@apollo/client";

export const LIST_PLAYLISTS = gql`
  query listPlaylists {
    listPlaylists
  }
`;
