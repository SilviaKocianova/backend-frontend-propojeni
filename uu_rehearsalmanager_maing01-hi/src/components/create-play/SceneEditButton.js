import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { Lsi, useLsi } from "uu5g05";
import lsiCreatePlay from "../../lsi/lsi-createplay";
import { updateScene } from "../../api/sceneApi"; 

const SceneEditButton = ({ sceneId, onSceneEdited }) => {
  const [isEditing, setIsEditing] = useState(false);
  const titleText = useLsi(lsiCreatePlay.editScene);


  const handleEdit = async () => {

    setIsEditing(true);


    const newSceneData = prompt("Edit scene details:");

    if (newSceneData && window.confirm("Are you sure you want to save the changes?")) {
      try {
     
        await updateScene(sceneId, { name: newSceneData }); 
        onSceneEdited(sceneId, newSceneData); 
      } catch (error) {
        alert("Failed to update scene. Please try again.");
      }
    }
    setIsEditing(false); 
  };

  return (
    <button
      className="scene-edit-button"
      onClick={handleEdit}
      title={titleText}
      disabled={isEditing} 
    >
      <FaEdit style={{ marginRight: "8px" }} />
      <Lsi lsi={lsiCreatePlay.editScene} />
    </button>
  );
};

export default SceneEditButton;
