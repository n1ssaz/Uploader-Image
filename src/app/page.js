"use client";
import { useState, useEffect } from "react";
import { Modal } from "antd";
import { BellOutlined } from "@ant-design/icons";
import SortFilter from "@/component/SortFilter";
import UploadBox from "@/component/UploadBox";
import SearchBar from "@/component/SearchBar";
import Register from "@/component/Register";
import api from "@/api/api";
import { sortFiles } from "@/utils/utils";
import { toast } from "react-toastify";

export default function Home() {
  const [loggedUser, setLoggedUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("name-asc");
  const [view, setView] = useState("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const getFiles = async () => {
    try {
      if (!loggedUser?.userId) return;
      const response = await api.get(`/files/${loggedUser.userId}`);
      setFiles(response.data);
    } catch (error) { }
  };

  const saveFiles = async (newFiles) => {
    try {
      const response = await api.post(`/files/${loggedUser?.userId}`, {
        files: newFiles,
      });
      setFiles(response.data);
    } catch (error) { }
  };

  const resetSearch = () => setSearchQuery("");

  const sortedFiles = sortFiles(files, sortOption);

  const filteredFiles = sortedFiles.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const showNotification = () => {
    toast.success("This is your notification message!", {
      position: "top-right",
      autoClose: 3000, // Closes after 3 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:3001/events");

    eventSource.addEventListener("file-upload", (event) => {
      try {
        console.log("📩 Received SSE Event:", event);

        const data = JSON.parse(event.data);
        console.log("🔔 SSE Data Received:", data);

        toast.success(`📢 ${data.message}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (err) {
        console.error("❌ SSE Parsing Error:", err);
      }
    });

    eventSource.onerror = (err) => {
      console.error("❌ SSE Connection Error:", err);
    };

    return () => eventSource.close();
  }, []);


  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="flex justify-between items-center bg-gray-800 text-white p-5 shadow-lg">
        <h1 className="text-2xl font-semibold">Imgur</h1>
        {/* Buttons & Notifications */}
        <div className="space-x-4 flex items-center">
          {loggedUser && (
            <button
              className="relative px-4 py-2 text-white rounded-lg hover:bg-gray-700 transition duration-200"
              onClick={showNotification}
            >
              <BellOutlined className="text-xl" />
            </button>
          )}

          {!loggedUser ? (
            <>
              <button
                className="px-5 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200"
                onClick={() => setIsLoginOpen(true)}
              >
                Log In
              </button>
              <button
                className="px-5 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition duration-200"
                onClick={() => setIsRegisterOpen(true)}
              >
                Register
              </button>
            </>
          ) : (
            <span className="text-lg">Hello, {loggedUser.username} </span>
          )}
          {loggedUser && (
            <>
              <button
                className="px-5 py-2 bg-yellow-500 rounded-lg hover:bg-yellow-600 transition duration-200"
                onClick={() => {
                  resetSearch();
                  setIsModalOpen(true);
                }}
              >
                Upload
              </button>

              <button
                className="px-5 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition duration-200"
                onClick={() => {
                  setFiles([]);
                  setLoggedUser(null);
                }}
              >
                Log out
              </button>
            </>
          )}
        </div>
      </header>

      {/* Sorting & Filtering + Search Bar */}
      <main className="flex flex-col flex-1 space-y-6">
        <div className="bg-gray-100 p-6 flex justify-between items-center w-full">
          <SortFilter
            onSortChange={(value) => {
              setSortOption(value);
              resetSearch();
            }}
            onViewChange={(view) => {
              setView(view);
              resetSearch();
            }}
          />
          <SearchBar onSearch={setSearchQuery} searchQuery={searchQuery} />
        </div>

        {/* Show initial upload message */}
        {files.length === 0 && (
          <div className="flex flex-1 justify-center items-center">
            <p className="text-gray-600 text-xl font-medium">Upload a file to get started!</p>
          </div>
        )}

        {/* Uploaded Files Section */}
        {filteredFiles.length > 0 && (
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
        )}

        {/* No Matching Files Message */}
        {filteredFiles.length === 0 && files.length > 0 && (
          <div className="flex flex-1 justify-center items-center">
            <p className="text-gray-500 text-lg">No matching files found.</p>
          </div>
        )}
      </main>

      {/* Register & Login Modal */}
      <Register
        isOpen={isLoginOpen || isRegisterOpen}
        onClose={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(false);
        }}
        isLogin={isLoginOpen}
        toggleAuth={() => {
          setIsLoginOpen(!isLoginOpen);
          setIsRegisterOpen(!isRegisterOpen);
        }}
        setLoggedUser={setLoggedUser}
      />

      {/* Upload Modal */}
      <Modal
        title="Upload Files"
        open={isModalOpen}
        onCancel={() => {
          resetSearch();
          setIsModalOpen(false);
        }}
        footer={null}
        centered
      >
        <UploadBox
          onClose={() => {
            resetSearch();
            setIsModalOpen(false);
          }}
          files={files}
          setFiles={setFiles}
          saveFiles={saveFiles}
        />
      </Modal>
    </div>
  );
}
