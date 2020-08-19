import { gql } from "@apollo/client";

export const LIST_PLAYLISTS = gql`
  query listPlaylists {
    listPlaylists {
      name
      id
      description
      images {
        height
        width
        url
      }
      tracks {
        total
      }
      public
    }
  }
`;
