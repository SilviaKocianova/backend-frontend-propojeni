// SceneDeleteButton.js
import React from "react";
import { FaTrash } from "react-icons/fa";
import { Lsi, useLsi } from "uu5g05";
import lsiCreatePlay from "../../lsi/lsi-createplay";
import { deleteScene } from "../../api/sceneApi"; // Importujte API funkci

const SceneDeleteButton = ({ sceneId, onDeleteSuccess }) => {
  const titleText = useLsi(lsiCreatePlay.deleteScene);

  const handleDelete = async () => {
    try {
      await deleteScene(sceneId); // Zavolání API
      onDeleteSuccess(sceneId); // Oznámení úspěchu (např. aktualizace seznamu scén)
      alert("Scene deleted successfully!"); // Volitelná zpráva
    } catch (error) {
      console.error("Failed to delete scene:", error);
      alert("Failed to delete scene: " + error.message); // Zobrazení chyby
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
