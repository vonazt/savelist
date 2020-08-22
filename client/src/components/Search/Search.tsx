import React, { Dispatch, SetStateAction } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Playlists } from "../../types";

type SearchProps = {
  playlists: Playlists;
  setPlaylists: Dispatch<SetStateAction<Playlists>>;
  setOffset: Dispatch<SetStateAction<number>>;
};

export const Search: React.FC<SearchProps> = ({
  playlists,
  setPlaylists,
  setOffset,
}: SearchProps) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const {
      target: { value },
    } = e;
    const filteredPlaylists = playlists.allPlaylists.filter(
      ({ name, owner: { display_name } }) =>
        name.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
        display_name.toLocaleLowerCase().includes(value.toLocaleLowerCase())
    );
    setOffset(0);
    setPlaylists({ ...playlists, filteredPlaylists });
  };

  return (
    <div className="sticky top-0 z-20">
      <div className="flex justify-end relative z-20">
        <FontAwesomeIcon icon={faSearch} className="absolute mr-6 mt-2 z-30" />
        <input
          type="search"
          className="mx-4 pl-2 py-1 pr-8 bg-gray-800 border-2 border-spotifyGreen rounded z-20"
          onChange={handleSearch}
        />
      </div>
    </div>
  );
};
