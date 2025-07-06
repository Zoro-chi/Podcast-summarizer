import React from "react";

export default function SkeletonCard() {
  return (
    <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse flex flex-col gap-2">
      <div className="h-5 w-2/3 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
      <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-1" />
      <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
      <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
      <div className="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
    </div>
  );
}
