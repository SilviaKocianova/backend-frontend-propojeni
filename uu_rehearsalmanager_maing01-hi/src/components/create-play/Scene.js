import React, { useState, useEffect } from "react";
import axios from "axios";  // Import axios for HTTP requests
import { useCreatePlayContext } from "../../context/CreatePlayContext";
import SceneDeleteButton from "./SceneDeleteButton";
import SceneNameForm from "./SceneNameForm";
import SceneNotesForm from "./SceneNotesForm";
import SceneFiguresList from "./SceneFiguresList";
import SceneFinishButton from "./SceneFinishButton";
import SceneEditButton from "./SceneEditButton";
import { Lsi } from "uu5g05";
import lsiCreatePlay from "../../lsi/lsi-createplay";

const Scene = ({ scene, onUpdateScene, onDeleteScene }) => {
  const [isValid, setIsValid] = useState(false);
  const { actors } = useCreatePlayContext();

  useEffect(() => {
    const allFiguresAssigned = scene.figures.every(
      (figure) => figure.assignedUser && figure.assignedUser.trim() !== ""
    );
    const valid =
      scene.name.trim() !== "" &&
      scene.notes.trim() !== "" &&
      scene.figures.length > 0 &&
      allFiguresAssigned;
    setIsValid(valid);
  }, [scene]);

  // Function to send scene update to the backend (Use PUT for updating)
  const handleUpdateSceneOnBackend = async (updatedData) => {
    try {
      const response = await axios.put(`/api/scene/${scene.id}`, updatedData);  // Use PUT instead of POST
      onUpdateScene(scene.id, response.data);  // Update state in the parent component
    } catch (error) {
      console.error("Error updating scene:", error);
    }
  };

  // Function to delete scene from the backend (Use DELETE for deleting)
  const handleDeleteSceneOnBackend = async () => {
    try {
      await axios.delete(`/api/scene/${scene.id}`);  // Use DELETE instead of POST
      onDeleteScene(scene.id);  // Remove scene from parent component
    } catch (error) {
      console.error("Error deleting scene:", error);
    }
  };

  // Function to add a new figure
  const handleAddFigure = async (figureName) => {
    const newFigure = {
      id: Date.now().toString(),
      name: figureName,
      assignedUser: "",
    };

    const updatedFigures = [...scene.figures, newFigure];
    await handleUpdateSceneOnBackend({ figures: updatedFigures });
  };

  const handleAssignUser = async (figureId, userId) => {
    const updatedFigures = scene.figures.map((figure) =>
      figure.id === figureId ? { ...figure, assignedUser: userId } : figure
    );
    await handleUpdateSceneOnBackend({ figures: updatedFigures });
  };

  const handleDeleteFigure = async (figureId) => {
    const updatedFigures = scene.figures.filter((figure) => figure.id !== figureId);
    await handleUpdateSceneOnBackend({ figures: updatedFigures });
  };

  const handleFinishScene = async () => {
    if (isValid) {
      await handleUpdateSceneOnBackend({ isFinished: true });
    }
  };

  const handleEditScene = async () => {
    await handleUpdateSceneOnBackend({ isFinished: false });
  };

  return (
    <div className={`scene ${scene.isFinished ? "finished" : ""}`}>
      <div className="scene-header">
        {!scene.isFinished && (
          <SceneDeleteButton onDelete={handleDeleteSceneOnBackend} />
        )}
      </div>
      {!scene.isFinished ? (
        <>
          <SceneNameForm
            initialName={scene.name}
            onSubmit={(name) => handleUpdateSceneOnBackend({ name })}
          />
          <SceneNotesForm
            initialNotes={scene.notes}
            onSubmit={(notes) => handleUpdateSceneOnBackend({ notes })}
          />
          <SceneFiguresList
            figures={scene.figures}
            onAddFigure={handleAddFigure}
            onAssignUser={handleAssignUser}
            onDeleteFigure={handleDeleteFigure}
          />
          <SceneFinishButton onFinishScene={handleFinishScene} isValid={isValid} />
        </>
      ) : (
        <>
          <div className="scene-summary">
            <p><strong><Lsi lsi={lsiCreatePlay.sceneNameLabel} /></strong> {scene.name}</p>
            <p><strong><Lsi lsi={lsiCreatePlay.sceneNotesLabel} /></strong> {scene.notes}</p>
            <div>
              <strong><Lsi lsi={lsiCreatePlay.figuresAndActorsLabel} /></strong>
              <ul>
                {scene.figures.map((figure) => {
                  const actor = actors.find((actor) => actor.id === figure.assignedUser);
                  return (
                    <li key={figure.id}>
                      {figure.name} - {actor ? actor.name : <Lsi lsi={lsiCreatePlay.unassigned} />}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <SceneEditButton onEdit={handleEditScene} />
        </>
      )}
    </div>
  );
};

export default Scene;
