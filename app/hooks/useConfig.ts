import { useEffect } from "react";
import fetchAPI from "../lib/api";
import useConfigStore from "../state/config";
import { SecureStorage } from "../lib/storage/secure-store";
import _ from "lodash";

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

    fetchConfig();
  }, [config.api_url]);

  return { ...config, setApiUrl };
};

export default useConfig;
