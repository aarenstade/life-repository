import { create } from "zustand";
import { ConfigData } from "../types/config";

type ConfigState = {
  loading: boolean;
  setLoading: (loading: boolean) => void;

  connected: boolean;
  setConnected: (connected: boolean) => void;

  api_url?: string;
  setApiUrl: (apiUrl: string) => void;

  data: ConfigData;
  setData: (configData: ConfigData) => void;

  error?: string;
  setError: (error: string) => void;
};

const useConfigStore = create<ConfigState>((set) => ({
  connected: false,
  loading: true,
  api_url: undefined,
  data: { root_paths: [] },
  error: undefined,
  setLoading: (loading) => set({ loading }),
  setConnected: (connected) => set({ connected }),
  setApiUrl: (apiUrl) => set({ api_url: apiUrl }),
  setData: (configData) => set({ data: configData }),
  setError: (error) => set({ error }),
}));

export default useConfigStore;
