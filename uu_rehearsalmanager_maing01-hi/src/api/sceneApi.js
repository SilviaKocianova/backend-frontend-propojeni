// api/sceneApi.js
const BASE_URL = "http://localhost:8080"; // Změňte dle konfigurace backendu.

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

  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "API call failed");
  }
  return response.json();
};

// Funkce pro smazání scény
export const deleteScene = async (sceneId) => {
  return apiCall(`/scene/delete`, "POST", { id: sceneId });
};
