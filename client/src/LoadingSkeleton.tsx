import React from "react";

export const LoadingSkeleton: React.FC<{}> = () => (
  <div className="border border-gray-300 shadow rounded-md p-4 max-w-1/2 w-3/4 mx-auto">
    <div className="animate-pulse flex space-x-4">
      <div className="flex-1 space-y-4 py-1">
        <div className="h-4 bg-gray-400 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-400 rounded"></div>
          <div className="h-4 bg-gray-400 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  </div>
);
