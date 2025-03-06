import { useState } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export default function SearchBar({ onSearch }) {
    const [query, setQuery] = useState("");

    const handleSearch = (e) => {
        setQuery(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <div className="relative w-full max-w-sm">
            <Input
                placeholder="Search files..."
                value={query}
                onChange={handleSearch}
                className="w-full px-4 py-2 pl-10 h-10 rounded-md border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-400 shadow-md"
                suffix={<SearchOutlined className="text-gray-500 text-lg" />}
            />
        </div>
    );
}
