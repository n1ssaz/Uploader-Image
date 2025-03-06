"use client";
import { useState, useEffect } from "react";
import { Modal } from "antd";
import SortFilter from "@/component/SortFilter";
import UploadBox from "@/component/UploadBox";
import SearchBar from "@/component/SearchBar";

export default function Home() {
  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("name-asc");
  const [view, setView] = useState("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showInitialMessage, setShowInitialMessage] = useState(true);

  useEffect(() => {
    if (files.length > 0) {
      setShowInitialMessage(false);
    }
  }, [files]);

  // Sorting logic
  const sortedFiles = [...files].sort((a, b) => {
    switch (sortOption) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "date-newest":
        return b.date - a.date;
      case "date-oldest":
        return a.date - b.date;
      case "size-smallest":
        return a.size - b.size;
      case "size-largest":
        return b.size - a.size;
      default:
        return 0;
    }
  });

  // Filter files
  const filteredFiles = sortedFiles.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="flex justify-between items-center bg-gray-800 text-white p-5 shadow-lg">
        <h1 className="text-2xl font-semibold">Wallet</h1>

        {/* Buttons */}
        <div className="space-x-4">
          <button className="px-5 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200">
            Log In
          </button>
          <button className="px-5 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition duration-200">
            Register
          </button>

          {/* Upload Button */}
          <button
            className="px-5 py-2 bg-yellow-500 rounded-lg hover:bg-yellow-600 transition duration-200"
            onClick={() => setIsModalOpen(true)}
          >
            Upload
          </button>
        </div>
      </header>

      {/* Sorting & Filtering + Search Bar */}
      <main className="flex flex-col flex-1 space-y-6">
        <div className="bg-gray-100 p-6 flex  items-center w-full">

          <SortFilter
            onSortChange={setSortOption}
            onViewChange={setView}
          />

          <SearchBar onSearch={setSearchQuery} />
        </div>

        {filteredFiles.length > 0 ? (
          <div className="w-full max-w-7xl bg-white p-6 rounded-lg shadow-md h-[600px] overflow-y-auto mx-auto">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Uploaded Files</h3>

            {/* Show filtered files in Grid or List view */}
            <div className={`${view === "grid" ? "grid grid-cols-4 gap-6" : "flex flex-col space-y-4"}`}>
              {filteredFiles.map((file) => (
                <div
                  key={file.name}
                  className="p-4 bg-gray-200 text-gray-700 rounded-lg flex items-center justify-between w-full"
                >
                  <div className="flex flex-col w-full text-wrap">
                    <span className="text-lg font-medium">{file.name}</span>
                    <span className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</span>
                    <span className="text-sm text-gray-500">{new Date(file.date).toLocaleDateString()}</span>
                  </div>

                  <img src={file.preview} alt="preview" className="w-24 h-24 object-cover rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          showInitialMessage && (
            <div className="flex flex-1 justify-center items-center">
              <p className="text-gray-600 text-xl font-medium">Upload a file to get started!</p>
            </div>
          )
        )}

        {filteredFiles.length === 0 && files.length > 0 && (
          <div className="flex flex-1 justify-center items-center">
            <p className="text-gray-500 text-lg">No matching files found.</p>
          </div>
        )}
      </main>

      {/* Ant Design Modal for Upload */}
      <Modal
        title="Upload Files"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
      >
        <UploadBox onClose={() => setIsModalOpen(false)} files={files} setFiles={setFiles} />
      </Modal>
    </div>
  );
}
