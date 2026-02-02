// src/Store1.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      userRole: "",
      tokenId:"",
      token: false,
      userEmail: "",
      setUserRole: (user) => set({ userRole: user }),
      setTokenId:(id)=>set({tokenId:id}),
      setToken: (val) => set({ token:val }),
      setUserEmail: (email) => set({ userEmail: email }),
      logout: () => set({ token: false, userEmail: "" }),
    }),
    {
      name: 'auth-storage', // persisted key
    }
  )
);

export default useStore;
