import { useEffect } from "react";
import fetchAPI from "../lib/api";
import useConfigStore from "../state/config";
import { SecureStorage } from "../lib/storage/secure-store";
import _ from "lodash";

const THRESHOLD_SECONDS = 60;

const useConfig = () => {
  const config = useConfigStore((state) => state);

  const setApiUrl = (apiUrl: string) => {
    config.setApiUrl(apiUrl);
    SecureStorage.saveItem("apiEndpoint", apiUrl);
  };

  useEffect(() => {
    const fetchApiUrl = async () => {
      config.setLoading(true);
      const storedApiUrl = await SecureStorage.getItem("apiEndpoint");
      if (storedApiUrl) {
        config.setApiUrl(storedApiUrl);
      }
      config.setLoading(false);
    };

    fetchApiUrl();
  }, []);

  useEffect(() => {
    const fetchConfig = async () => {
      config.setLoading(true);
      config.setConnected(false);
      if (!config.api_url) {
        config.setLoading(false);
        config.setError("API URL is not set");
        return;
      }
      config.setError(null);
      try {
        const response = await fetchAPI(config.api_url.trim(), "/config", {}, "GET");
        if (response.success && response.data) {
          if (!_.isEqual(response.data, config.data)) {
            config.setData(response.data);
          }
          config.setLastFetch(new Date().toISOString());
          config.setConnected(true);
        } else {
          config.setError(response.message || "Failed to fetch config");
        }
      } catch (err) {
        config.setError(err);
      } finally {
        config.setLoading(false);
      }
    };

    const shouldFetchConfig = () => {
      if (!config.last_fetch) {
        return true;
      }
      const lastFetchTime = new Date(config.last_fetch).getTime();
      const currentTime = new Date().getTime();
      const timeDifference = (currentTime - lastFetchTime) / 1000;

      return timeDifference > THRESHOLD_SECONDS;
    };

    if (shouldFetchConfig()) {
      fetchConfig();
    }
  }, [config.api_url, config.last_fetch]);

  return { ...config, setApiUrl };
};

export default useConfig;
