import { create } from "zustand";
import { Developer } from "../types";
import { api } from "../services/api";

interface DevelopersState {
  developers: Developer[];
  loading: boolean;
  error: string | null;
  fetchDevelopers: () => Promise<void>;
  addDeveloper: (
    developer: Partial<Developer>
  ) => Promise<Developer | undefined>;
  updateDeveloper: (developer: Developer) => Promise<Developer | undefined>;
}

export const useDevelopersStore = create<DevelopersState>((set) => ({
  developers: [],
  loading: false,
  error: null,
  fetchDevelopers: async () => {
    set({ loading: true });
    try {
      const developers = await api.developers.getAll();
      set({ developers });
    } catch (error) {
      console.error("Error fetching developers:", error);
    } finally {
      set({ loading: false });
    }
  },
  addDeveloper: async (developer) => {
    try {
      const newDeveloper = await api.developers.add(developer);
      set((state) => ({ developers: [...state.developers, newDeveloper] }));
      return newDeveloper;
    } catch (error) {
      console.error("Error adding developer:", error);
      return undefined;
    }
  },
  updateDeveloper: async (developer) => {
    try {
      const updatedDeveloper = await api.developers.update(developer);
      set((state) => {
        const newState = {
          developers: state.developers.map((dev) =>
            dev.id === updatedDeveloper.id ? updatedDeveloper : dev
          ),
        };
        return newState;
      });
      return updatedDeveloper;
    } catch (error) {
      console.error("Error updating developer:", error);
      return undefined;
    }
  },
}));
