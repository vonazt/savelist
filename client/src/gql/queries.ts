import { gql } from "@apollo/client";

export const LIST_DATA = gql`
  query listData {
    list {
      name
      age
      _id
    }
  }
`;
