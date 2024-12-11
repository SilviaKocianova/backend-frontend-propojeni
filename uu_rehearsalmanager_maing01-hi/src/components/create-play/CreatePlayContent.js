import React, { useEffect } from "react";
import { FaPlus, FaList } from "react-icons/fa";
import { useCreatePlayContext } from "../../context/CreatePlayContext";
import CPModal from "./CPModal";
import CPFinishButton from "./CPFinishButton";
import CPScenesList from "./CPScenesList";
import CPTitle from "./CPTitle";
import { Lsi } from "uu5g05";
import lsiCreatePlay from "../../lsi/lsi-createplay";
import { listScenes } from "../../api/sceneApi";  

const CreatePlayContent = () => {
  const {
    selectedPlay,
    playsList,
    scenes,
    handleSelectPlay,
    handleFinish,
    handleAddScene,
    handleUpdateScene,
    handleDeleteScene,
  } = useCreatePlayContext();

  const [isCPModalOpen, setIsCPModalOpen] = React.useState(false);

  const handleOpenCPModal = () => {
    setIsCPModalOpen(true);
  };

  const handleCloseCPModal = () => {
    setIsCPModalOpen(false);
  };

  const allScenesFinished = scenes.length > 0 && scenes.every((scene) => scene.isFinished);

 
  useEffect(() => {
    const fetchScenes = async () => {
      if (selectedPlay) {
        try {
          const fetchedScenes = await listScenes(); // Fetch scenes from backend
          fetchedScenes.forEach((scene) => {
            handleAddScene(scene); // Add each fetched scene to the context state
          });
        } catch (error) {
          console.error("Failed to fetch scenes:", error);
        }
      }
    };

    fetchScenes();
  }, [selectedPlay, handleAddScene]);

  const handleAddNewScene = async () => {
    try {
      const newScene = {
        name: "",
        notes: "",
        figures: [],
        isFinished: false,
      };

      await handleAddScene(newScene);
    } catch (error) {
      console.error("Failed to create a new scene:", error);
    }
  };

  return (
    <div className="create-play-container">
      {/* Removed StatusIndicator component */}
      <div className="create-play-header">
        <button
          className="cp-button"
          onClick={handleOpenCPModal}
          title={<Lsi lsi={lsiCreatePlay.selectPlay} />}
        >
          <FaList size={24} />
        </button>
        {selectedPlay && (
          <>
            <CPTitle title={selectedPlay.name} />
            <button
              className="scene-add-button"
              onClick={handleAddNewScene}  // Trigger scene creation here
              title={<Lsi lsi={lsiCreatePlay.addScene} />}
            >
              <FaPlus
                size={20}
                style={{ marginLeft: "10px", marginRight: "5px" }}
              />
              <Lsi lsi={lsiCreatePlay.addScene} />
            </button>
          </>
        )}
      </div>
      <CPModal
        isOpen={isCPModalOpen}
        playsList={playsList}
        onSelectPlay={handleSelectPlay}
        onClose={handleCloseCPModal}
      />
      {selectedPlay && (
        <>
          <CPScenesList
            scenes={scenes}  // Pass the fetched scenes to CPScenesList
            onAddScene={handleAddScene} 
            onUpdateScene={handleUpdateScene}
            onDeleteScene={handleDeleteScene}
          />
          <CPFinishButton onFinish={handleFinish} disabled={!allScenesFinished} />
        </>
      )}
    </div>
  );
};

export default CreatePlayContent;
