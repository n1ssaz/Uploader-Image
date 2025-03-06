import { useState } from "react";
import { FiGrid, FiList } from "react-icons/fi";

export default function SortFilter({ onSortChange, onViewChange }) {
    const [view, setView] = useState("grid");

    const handleViewChange = (newView) => {
        setView(newView);
        onViewChange(newView);
    };

    return (
        <div className="flex items-center space-x-4 p-4 bg-gray-100 w-full">
            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
                <span className="text-gray-600 font-medium">Sort by</span>
                <select
                    onChange={(e) => onSortChange(e.target.value)}
                    className="border rounded-md px-3 py-1 bg-white shadow-sm focus:ring focus:ring-blue-300"
                >
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="date-newest">Date (Newest)</option>
                    <option value="date-oldest">Date (Oldest)</option>
                    <option value="size-smallest">Size (Smallest)</option>
                    <option value="size-largest">Size (Largest)</option>
                </select>
            </div>

            {/* Grid/List Toggle */}
            <div className="flex space-x-2">
                <button
                    className={`p-2 rounded-md ${view === "grid" ? "bg-gray-300" : "bg-white"} shadow-sm hover:bg-gray-200 transition`}
                    onClick={() => handleViewChange("grid")}
                >
                    <FiGrid className="text-gray-700" />
                </button>

                <button
                    className={`p-2 rounded-md ${view === "list" ? "bg-gray-300" : "bg-white"} shadow-sm hover:bg-gray-200 transition`}
                    onClick={() => handleViewChange("list")}
                >
                    <FiList className="text-gray-700" />
                </button>
            </div>
        </div>
    );
}
