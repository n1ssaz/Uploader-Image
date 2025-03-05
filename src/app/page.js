"use client"
export default function Home() {
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
      <main className="flex-1 flex items-center justify-center bg-gray-100">
        <h2 className="text-2xl font-semibold">Welcome to the Image Upload Platform</h2>
      </main>
    </div>
  );
}
