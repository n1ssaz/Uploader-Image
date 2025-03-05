import { useState } from "react";
import { FiGrid, FiList } from "react-icons/fi";

export default function SortFilter({ onSortChange, onCategoryChange, onViewChange }) {
    const [view, setView] = useState("grid");

    return (
        <div className="flex items-center space-x-4 p-4 bg-gray-100 w-full max-w-4xl">
            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
                <span className="text-gray-600 font-medium">Sort by</span>
                <select
                    onChange={(e) => onSortChange(e.target.value)}
                    className="border rounded-md px-3 py-1 bg-white shadow-sm focus:ring focus:ring-blue-300"
                >
                    <option value="name">Name</option>
                    <option value="date">Date</option>
                    <option value="size">Size</option>
                </select>
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
                <span className="text-gray-600 font-medium">Categories</span>
                <select
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="border rounded-md px-3 py-1 bg-white shadow-sm focus:ring focus:ring-blue-300"
                >
                    <option value="all">All</option>
                    <option value="images">Images</option>
                    <option value="videos">Videos</option>
                    <option value="documents">Documents</option>
                </select>
            </div>

            {/* Grid/List Toggle */}
            <div className="flex space-x-2">
                <button
                    className={`p-2 rounded-md ${view === "grid" ? "bg-gray-300" : "bg-white"
                        } shadow-sm hover:bg-gray-200 transition`}
                    onClick={() => {
                        setView("grid");
                        onViewChange("grid");
                    }}
                >
                    <FiGrid className="text-gray-700" />
                </button>

                <button
                    className={`p-2 rounded-md ${view === "list" ? "bg-gray-300" : "bg-white"
                        } shadow-sm hover:bg-gray-200 transition`}
                    onClick={() => {
                        setView("list");
                        onViewChange("list");
                    }}
                >
                    <FiList className="text-gray-700" />
                </button>
            </div>
        </div>
    );
}
