import React, { useState, useEffect } from "react";
import {
  updateScene,
  deleteScene,
} from "../../api/sceneApi";
import { useCreatePlayContext } from "../../context/CreatePlayContext";
import SceneDeleteButton from "./SceneDeleteButton";
import SceneNameForm from "./SceneNameForm";
import SceneNotesForm from "./SceneNotesForm";
import SceneFiguresList from "./SceneFiguresList";
import SceneFinishButton from "./SceneFinishButton";
import SceneEditButton from "./SceneEditButton";
import { Lsi } from "uu5g05";
import lsiCreatePlay from "../../lsi/lsi-createplay";

const Scene = ({ scene, onUpdateScene, refreshScenes }) => {
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

  const handleUpdateScene = async (data) => {
    try {
      await updateScene(scene.id, data);
      onUpdateScene(scene.id, data);
      refreshScenes();
    } catch (error) {
      console.error("Failed to update scene:", error);
    }
  };

  const handleDeleteScene = async () => {
    try {
      await deleteScene(scene.id);
      refreshScenes();
    } catch (error) {
      console.error("Failed to delete scene:", error);
    }
  };

  const handleNameSubmit = (name) => {
    handleUpdateScene({ name });
  };

  const handleNotesSubmit = (notes) => {
    handleUpdateScene({ notes });
  };

  const handleAddFigure = (figureName) => {
    const newFigure = {
      id: Date.now().toString(),
      name: figureName,
      assignedUser: "",
    };
    handleUpdateScene({ figures: [...scene.figures, newFigure] });
  };

  const handleAssignUser = (figureId, userId) => {
    const updatedFigures = scene.figures.map((figure) =>
      figure.id === figureId ? { ...figure, assignedUser: userId } : figure
    );
    handleUpdateScene({ figures: updatedFigures });
  };

  const handleDeleteFigure = (figureId) => {
    const updatedFigures = scene.figures.filter((figure) => figure.id !== figureId);
    handleUpdateScene({ figures: updatedFigures });
  };

  const handleFinishScene = () => {
    if (isValid) {
      handleUpdateScene({ isFinished: true });
    }
  };

  const handleEditScene = () => {
    handleUpdateScene({ isFinished: false });
  };

  return (
    <div className={`scene ${scene.isFinished ? "finished" : ""}`}>
      <div className="scene-header">
        {!scene.isFinished && (
          <SceneDeleteButton onDelete={handleDeleteScene} />
        )}
      </div>
      {!scene.isFinished ? (
        <>
          <SceneNameForm
            initialName={scene.name}
            onSubmit={handleNameSubmit}
          />
          <SceneNotesForm
            initialNotes={scene.notes}
            onSubmit={handleNotesSubmit}
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
