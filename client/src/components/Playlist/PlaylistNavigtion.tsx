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
    Math.ceil(playlists.filteredPlaylists.length / 12)
  );

  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    setCurrentPage(offset / 12 + 1);
  }, [offset]);

  useEffect(() => {
    // setNumberOfPages(Math.ceil(playlists.filteredPlaylists.length / 12));
    setNumberOfPages(20)
  }, [playlists.filteredPlaylists.length]);

  const handleSelectPage = (pageNumber: number): void => {
    window.scrollTo(0, 0);
    setOffset((pageNumber - 1) * 12);
  };

  const PageNumberButton = (pageNumber: number): JSX.Element => (
    <button
      className={`text-xl italic ${
        currentPage === pageNumber
          ? `text-gray-600 cursor-default`
          : `underline`
      }`}
      onClick={() => handleSelectPage(pageNumber)}
      key={pageNumber}
      disabled={currentPage === pageNumber}
    >
      {pageNumber}
    </button>
  );

  const generatePageNumberButtons = (index: number): JSX.Element | null => {
    const pageNumber = index + 2;
    if (pageNumber >= numberOfPages) return null;
    if (window.innerWidth > 640 && numberOfPages > 10) {
      if (pageNumber >= currentPage - 3 && pageNumber <= currentPage + 3) {
        return PageNumberButton(pageNumber);
      } else return null;
    }
    if (window.innerWidth <= 640 && numberOfPages > 6) {
      if (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1) {
        return PageNumberButton(pageNumber);
      } else return null;
    }
    return PageNumberButton(pageNumber);
  };

  const isDisplayEllipsisByPageOne =
    (window.innerWidth <= 640 && numberOfPages > 6 && currentPage > 3) ||
    (window.innerWidth > 640 && numberOfPages > 10 && currentPage > 5);

  const isDisplayEllipsisByFinalPage =
    (window.innerWidth <= 640 &&
      numberOfPages > 6 &&
      currentPage < numberOfPages - 2) ||
    (window.innerWidth > 640 &&
      numberOfPages > 10 &&
      currentPage < numberOfPages - 4);

  return (
    <div className={`mx-4 flex`}>
      <div className="flex justify-start w-1/3">
        {offset > 0 && (
          <button
            onClick={() => moveOnePage(`previous`)}
            disabled={offset === 0}
            className="hover:underline"
          >
            <span className="text-spotifyGreen text-xl">{`<<< `}</span>
            {window.innerWidth > 640 && (
              <span className="text-xl italic">Previous</span>
            )}
          </button>
        )}
      </div>
      <div className="flex justify-center w-1/3 space-x-4">
        {PageNumberButton(1)}
        {isDisplayEllipsisByPageOne && (
          <span className="lg:px-1 pt-2">...</span>
        )}
        {Object.keys(Array.apply(0, Array(numberOfPages))).map((_, index) =>
          generatePageNumberButtons(index)
        )}
        {isDisplayEllipsisByFinalPage && (
          <span className="lg:px-1 pt-2">...</span>
        )}
        {PageNumberButton(numberOfPages)}
      </div>

      <div className="flex justify-end w-1/3">
        {playlists.filteredPlaylists.length - offset >= 12 && (
          <button
            className="hover:underline"
            onClick={() => moveOnePage(`next`)}
          >
            {window.innerWidth > 640 && (
              <span className="text-xl italic">Next</span>
            )}
            <span className="text-spotifyGreen text-xl">{` >>>`}</span>
          </button>
        )}
      </div>
    </div>
  );
};
