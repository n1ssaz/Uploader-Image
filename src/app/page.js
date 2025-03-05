"use client";
import { useState } from "react";
import SortFilter from "@/component/SortFilter";

export default function Home() {
  const [sortOption, setSortOption] = useState("name");
  const [category, setCategory] = useState("all");
  const [view, setView] = useState("grid");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center bg-gray-600 text-white p-4 shadow-md">
        <h1 className="text-xl font-bold">Wallet</h1>

        {/* Buttons */}
        <div className="space-x-4">
          <button className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition">
            Log In
          </button>
          <button className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 transition">
            Register
          </button>
          <button className="px-4 py-2 bg-yellow-500 rounded hover:bg-yellow-600 transition">
            Upload
          </button>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 bg-gray-100 p-6">
        {/* Sorting & Filtering Section */}
        <SortFilter
          onSortChange={setSortOption}
          onCategoryChange={setCategory}
          onViewChange={setView}
        />

        {/* File Listing */}
        <div className={`mt-4 ${view === "grid" ? "grid grid-cols-3 gap-4" : "flex flex-col space-y-2"}`}>
          {/* Example Files */}
          <div className="p-4 bg-white shadow rounded">File 1</div>
          <div className="p-4 bg-white shadow rounded">File 2</div>
          <div className="p-4 bg-white shadow rounded">File 3</div>
        </div>
      </main>
    </div>
  );
}
