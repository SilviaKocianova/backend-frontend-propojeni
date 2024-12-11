// CreatePlayContent.js
import React from "react";
import { FaPlus, FaList } from "react-icons/fa";
import { useCreatePlayContext } from "../../context/CreatePlayContext";
import CPModal from "./CPModal";
import CPFinishButton from "./CPFinishButton";
import CPScenesList from "./CPScenesList";
import CPTitle from "./CPTitle";
import { Lsi } from "uu5g05";
import lsiCreatePlay from "../../lsi/lsi-createplay";
import axios from "axios";

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
    setScenes,
  } = useCreatePlayContext();

  const [isCPModalOpen, setIsCPModalOpen] = React.useState(false);

  const handleOpenCPModal = () => {
    setIsCPModalOpen(true);
  };

  const handleCloseCPModal = () => {
    setIsCPModalOpen(false);
  };

  // Check if all scenes are finished
  const allScenesFinished = scenes.length > 0 && scenes.every((scene) => scene.isFinished);

  const createScene = async () => {
    if (!selectedPlay) {
      console.error("No play selected");
      return;
    }

    try {
      const response = await axios.post("/api/scenes/create", {
        playId: selectedPlay.id,
        name: `Scene ${scenes.length + 1}`,
      });

      if (response.data) {
        // Update scenes with the new scene
        setScenes((prevScenes) => [...prevScenes, response.data]);
        console.log("Scene created successfully:", response.data);
      }
    } catch (error) {
      console.error("Error creating scene:", error);
    }
  };

  const onSceneDeleted = (deletedSceneId) => {
    console.log(`Scene with ID ${deletedSceneId} was deleted.`);
    // Optional: Refresh the UI or perform additional actions here
  };

  return (
    <div className="create-play-container">
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
              onClick={createScene}
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
            scenes={scenes}
            onAddScene={handleAddScene}
            onUpdateScene={handleUpdateScene}
            onDeleteScene={(sceneId) => {
              handleDeleteScene(sceneId);
              onSceneDeleted(sceneId);
            }}
          />
          <CPFinishButton onFinish={handleFinish} disabled={!allScenesFinished} />
        </>
      )}
    </div>
  );
};

export default CreatePlayContent;
