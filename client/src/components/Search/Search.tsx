import React, { Dispatch, SetStateAction } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Playlists } from "../../types";

type SearchProps = {
  playlists: Playlists;
  setPlaylists: Dispatch<SetStateAction<Playlists>>;
};

export const Search: React.FC<SearchProps> = ({
  playlists,
  setPlaylists,
}: SearchProps) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const {
      target: { value },
    } = e;
    const filteredPlaylists = playlists.allPlaylists.filter(({ name }) =>
      name.toLocaleLowerCase().includes(value.toLocaleLowerCase())
    );
    setPlaylists({ ...playlists, filteredPlaylists });
  };

  return (
    <div className="flex justify-end relative">
      <FontAwesomeIcon icon={faSearch} className="absolute mr-6 mt-2" />
      <input
        type="search"
        className="mx-4 pl-2 py-1 pr-8 bg-gray-800 border-2 border-spotifyGreen rounded"
        onChange={handleSearch}
      />
    </div>
  );
};
