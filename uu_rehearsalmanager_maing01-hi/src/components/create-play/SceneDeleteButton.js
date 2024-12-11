// SceneDeleteButton.js
import React from "react";
import { FaTrash } from "react-icons/fa";
import { Lsi, useLsi } from "uu5g05";
import lsiCreatePlay from "../../lsi/lsi-createplay";
import { deleteScene } from "../../api/sceneApi"; // Import the API function

const SceneDeleteButton = ({ sceneId, onSceneDeleted }) => {
  const titleText = useLsi(lsiCreatePlay.deleteScene);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this scene?")) {
      try {
        await deleteScene(sceneId); // Call the delete API
        onSceneDeleted(sceneId); // Notify parent component (optional)
      } catch (error) {
        alert("Failed to delete scene. Please try again.");
      }
    }
  };

  return (
    <button
      className="scene-delete-button"
      onClick={handleDelete}
      title={titleText}
    >
      <FaTrash />
    </button>
  );
};

export default SceneDeleteButton;
