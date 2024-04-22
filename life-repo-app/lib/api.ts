interface APIResponse {
  success: boolean;
  message?: any;
  code: number;
  data?: any;
}

const createServerURL = (url: string, endpoint: string): string => {
  return new URL(endpoint, url).toString();
};

const parseParams = (params: any) =>
  "?" +
  Object.keys(params)
    .map((key) => key + "=" + params[key])
    .join("&");

const fetchAPI = async (url: string, endpointName: string, params?: any, method: string = "GET", dataType: string = "json"): Promise<APIResponse> => {
  try {
    let endpoint = createServerURL(url, endpointName);

    console.log(endpoint);

    let options: any = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (endpointName.includes("admin")) options["cache"] = "no-store";

    if (method === "POST" || method === "PUT" || method === "PATCH") {
      options["body"] = JSON.stringify(params);
    } else {
      endpoint = params ? endpoint + parseParams(params) : endpoint;
    }

    const res = await fetch(endpoint, options);
    if (res.status === 200) {
      if (dataType === "blob") {
        const data = await res.blob();
        return { success: true, data, code: res.status };
      }

      const data = await res.json();
      return { success: true, data, code: res.status };
    }

    return { success: false, code: res.status };
  } catch (error) {
    console.error(`fetch error: ${JSON.stringify(error)}`);
    return { success: false, message: error, code: 500 };
  }
};

export default fetchAPI;
