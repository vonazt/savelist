import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Playlists } from "../../types";

type PlaylistNavigationProps = {
  offset: number;
  setOffset: Dispatch<SetStateAction<number>>;
  playlists: Playlists;
};

export const PlaylistNavigation: React.FC<PlaylistNavigationProps> = ({
  offset,
  setOffset,
  playlists,
}: PlaylistNavigationProps) => {
  const moveOnePage = (direction: string): void => {
    if (direction === `next`) {
      window.scrollTo(0, 0);
      setOffset(offset + 12);
    }
    if (direction === `previous`) {
      window.scrollTo(0, 0);
      setOffset(offset - 12);
    }
  };

  const [numberOfPages, setNumberOfPages] = useState<number>(
    Math.floor(playlists.filteredPlaylists.length / 12)
  );

  console.log(
    "number of pages",
    Object.keys(Array.apply(0, Array(numberOfPages))).map(
      (_, index) => index + 1
    )
  );

  useEffect(() => {
    setNumberOfPages(Math.floor(playlists.filteredPlaylists.length / 12));
  }, [playlists.filteredPlaylists.length]);

  return (
    <div className={`mx-4 flex`}>
      <div className="flex justify-start w-1/3">
        {offset > 0 && (
          <button
            onClick={() => moveOnePage(`previous`)}
            disabled={offset === 0}
          >
            <span className="text-spotifyGreen text-xl">{`<<< `}</span>
            <span className="text-xl italic">Previous</span>
          </button>
        )}
      </div>
      <div className="flex justify-center w-1/3 space-x-4">
        {Object.keys(Array.apply(0, Array(numberOfPages))).map((_, index) => (
          <button className="text-xl" key={index}>{index + 1}</button>
        ))}
      </div>
      <div className="flex justify-end w-1/3">
        {playlists.filteredPlaylists.length - offset >= 12 && (
          <button onClick={() => moveOnePage(`next`)}>
            <span className="text-xl italic">Next</span>
            <span className="text-spotifyGreen text-xl">{` >>>`}</span>
          </button>
        )}
      </div>
    </div>
  );
};
