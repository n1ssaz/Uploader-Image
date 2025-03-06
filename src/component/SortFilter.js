import { useState } from "react";
import { FiGrid, FiList } from "react-icons/fi";

export default function SortFilter({ onSortChange, onViewChange }) {
    const [view, setView] = useState("grid");

    const handleViewChange = (newView) => {
        setView(newView);
        onViewChange(newView);
    };

    // Sorting options list
    const sortOptions = [
        { value: "name-asc", label: "Name (A-Z)" },
        { value: "name-desc", label: "Name (Z-A)" },
        { value: "date-newest", label: "Date (Newest)" },
        { value: "date-oldest", label: "Date (Oldest)" },
        { value: "size-smallest", label: "Size (Smallest)" },
        { value: "size-largest", label: "Size (Largest)" },
    ];

    return (
        <div className="flex items-center space-x-4 p-4 bg-gray-100 w-full">
            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
                <span className="text-gray-600 font-medium">Sort by</span>
                <select
                    onChange={(e) => onSortChange(e.target.value)}
                    className="border rounded-md px-3 py-1 bg-white shadow-sm focus:ring focus:ring-blue-300"
                >
                    {sortOptions.map(({ value, label }) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Grid/List Toggle */}
            <div className="flex space-x-2">
                {[
                    { icon: <FiGrid className="text-gray-700" />, mode: "grid" },
                    { icon: <FiList className="text-gray-700" />, mode: "list" },
                ].map(({ icon, mode }) => (
                    <button
                        key={mode}
                        className={`p-2 rounded-md ${view === mode ? "bg-gray-300" : "bg-white"} shadow-sm hover:bg-gray-200 transition`}
                        onClick={() => handleViewChange(mode)}
                    >
                        {icon}
                    </button>
                ))}
            </div>
        </div>
    );
}
