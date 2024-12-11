const API_BASE_URL = "http://localhost:1234/api"; 

export async function deleteScene(sceneId) {
  try {
    const response = await fetch(`${API_BASE_URL}/scenes/${sceneId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete scene with ID ${sceneId}: ${response.statusText}`);
    }

    return await response.json(); 
  } catch (error) {
    console.error("Error deleting scene:", error);
    throw error;
  }
}
