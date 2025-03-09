import { useEffect, useState } from "react";
import { Input } from "antd";
import { SearchOutlined, CloseCircleOutlined } from "@ant-design/icons";

export default function SearchBar({ onSearch, searchQuery }) {
    const [query, setQuery] = useState("");

    useEffect(() => {
        setQuery(searchQuery); // ✅ Sync external changes (when clicking Upload, etc.)
    }, [searchQuery]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setQuery(value);
        onSearch(value);
    };

    const clearSearch = () => {
        setQuery("");
        onSearch("");
    };

    return (
        <div className="relative w-full max-w-sm">
            <Input
                placeholder="Search files..."
                value={query}
                onChange={handleSearch}
                className="w-full px-4 py-2 pl-10 h-10 rounded-md border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-400 shadow-md"
                suffix={
                    query ? (
                        <CloseCircleOutlined
                            className="text-gray-500 text-lg cursor-pointer hover:text-red-500"
                            onClick={clearSearch}
                        />
                    ) : (
                        <SearchOutlined className="text-gray-500 text-lg" />
                    )
                }
            />
        </div>
    );
}
