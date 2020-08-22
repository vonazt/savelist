import React from "react";

export const LoadingSkeleton: React.FC<{}> = () => (
  <div className="border border-spotifyGreen shadow rounded-md p-4 max-w-1/2 w-3/4 mx-auto">
    <div className="animate-pulse flex justify-content space-x-4">
      <div className="flex-1 space-y-4 py-1">
        <div className="flex content-center justify-center">
          <div className="h-48 bg-spotifyGreen rounded w-48"></div>
        </div>
        <div className="h-4 bg-spotifyGreen rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-spotifyGreen rounded"></div>
          <div className="h-4 bg-spotifyGreen rounded w-5/6"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-spotifyGreen rounded"></div>
          <div className="h-4 bg-spotifyGreen rounded w-5/6"></div>
        </div>
      </div>
    </div>
  </div>
);
