import { useState, useEffect } from "react";
import fetchAPI from "../lib/api";
import useConfig from "./useConfig";

interface QueryParams {
  [key: string]: string | number | boolean;
}

interface UseQueryResponse<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

const useQuery = <T = any>(path: string, queryParams?: QueryParams): UseQueryResponse<T> => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { api_url } = useConfig();

  useEffect(() => {
    let isMounted = true; // Flag to check component mount status

    const fetchData = async () => {
      if (!api_url) {
        setError("API URL is not set");
        if (isMounted) setIsLoading(false);
        return;
      }

      if (isMounted) {
        setIsLoading(true);
        setError(null);
      }

      try {
        const response = await fetchAPI(api_url, path, queryParams);
        if (response.success && response.data) {
          if (isMounted) setData(response.data);
        } else {
          console.log(response);
          if (isMounted) setError(response.data.message || "Failed to fetch data");
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || "An error occurred while fetching data");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Cleanup function to set isMounted to false when the component unmounts
    };
  }, [api_url, path, JSON.stringify(queryParams)]); // Use JSON.stringify to correctly memoize complex objects

  return { data, isLoading, error };
};
export default useQuery;
