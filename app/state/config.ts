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

  last_fetch?: string;
  setLastFetch: (lastFetch: string) => void;
};

const useConfigStore = create<ConfigState>((set) => ({
  connected: false,
  loading: true,
  api_url: undefined,
  data: { root_paths: [] },
  error: undefined,
  last_fetch: undefined,
  setLoading: (loading) => set({ loading }),
  setConnected: (connected) => set({ connected }),
  setApiUrl: (apiUrl) => set({ api_url: apiUrl }),
  setData: (configData) => set({ data: configData }),
  setError: (error) => set({ error }),
  setLastFetch: (lastFetch) => set({ last_fetch: lastFetch }),
}));

export default useConfigStore;
