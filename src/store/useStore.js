import { create } from 'zustand';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const useStore = create((set) => ({
  // User state
  user: null,
  loading: true,
  
  // Theme state
  theme: localStorage.getItem('theme') || 'dark',
  
  // Actions
  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),
  
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    
    // Update document class
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    return { theme: newTheme };
  }),
  
  // Initialize auth listener
  initAuth: () => {
    onAuthStateChanged(auth, (user) => {
      set({ user, loading: false });
    });
  },
}));

export default useStore;
