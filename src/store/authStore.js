import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null, // Stores user data
      token: null, // Stores JWT token
      isHydrated: false, // Tracks hydration state

      // Login function
      login: (userData, token) => set({ user: userData, token }),

      // Logout function
      logout: () => set({ user: null, token: null }),

      // Mark hydration complete
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "auth-storage", // Key for localStorage
      getStorage: () => localStorage, // Use localStorage
      onRehydrateStorage: () => (state) => {
        state.setHydrated(); // Called when Zustand has restored state
      },
    }
  )
);

export default useAuthStore;
