"use client";
import { useState } from "react";
import { Modal } from "antd"; // Ant Design Modal
import SortFilter from "@/component/SortFilter";
import UploadBox from "@/component/UploadBox";

export default function Home() {
  const [files, setFiles] = useState([]);
  const [sortOption, setSortOption] = useState("name");
  const [category, setCategory] = useState("all");
  const [view, setView] = useState("grid");
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

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
          {/* Upload Button that opens modal */}
          <button
            className="px-5 py-2 bg-yellow-500 rounded-lg hover:bg-yellow-600 transition duration-200"
            onClick={() => setIsModalOpen(true)}
          >
            Upload
          </button>
        </div>
      </header>

      {/* Sorting & Filtering Section */}

      <main className="flex flex-col flex-1 items-center  p-6 space-y-6">
        {/* Sorting & Filtering Section */}
        <div className="bg-gray-100 p-6 flex flex-col items-start w-full">
          <SortFilter
            onSortChange={setSortOption}
            onCategoryChange={setCategory}
            onViewChange={setView}
          />
        </div>
        {files.length > 0 && (
          <div className="w-full max-w-2xl bg-white p-4 rounded-lg shadow-md h-[500px] overflow-y-scroll mx-auto">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Uploaded Files</h3>

            {/* Show files in Grid or List view */}
            <div className={`${view === "grid" ? "grid grid-cols-3 gap-4" : "flex flex-col space-y-3"}`}>
              {files.map((file) => (
                <div
                  key={file.name}
                  className="p-3 bg-gray-200 text-gray-700 rounded-lg flex items-center justify-between"
                >
                  <span className="truncate w-40">{file.name}</span>
                  <img src={file.preview} alt="preview" className="w-16 h-16 object-cover rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>


      {/* Ant Design Modal for Upload */}
      <Modal
        title="Upload Files"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null} // Removes default footer
        centered // Centers the modal on the screen
      >
        <UploadBox onClose={() => setIsModalOpen(false)} files={files} setFiles={setFiles} />
      </Modal>
    </div>
  );
}
