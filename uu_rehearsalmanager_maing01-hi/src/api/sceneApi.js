const apiCall = async (endpoint, method = "GET", body = null) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(endpoint, options); // This will use the proxy configured in package.json
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "API call failed");
  }
  return response.json();
};

// API functions that use apiCall
export const createScene = (data) => apiCall("/scene/create", "POST", data);
export const listScenes = () => apiCall("/scene/list");
export const updateScene = (id, data) => apiCall(`/scene/update`, "POST", { id, ...data });
export const deleteScene = (id) => apiCall(`/scene/delete`, "POST", { id });
