import React, { useRef } from "react";
import Scene from "./Scene";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Lsi, useLsi } from "uu5g05";
import lsiCreatePlay from "../../lsi/lsi-createplay";
import { updateScene } from "../../api/sceneApi"; 

const CPScenesList = ({ scenes, onUpdateScene, onDeleteScene }) => {
  const scrollContainerRef = useRef(null);
  const previousText = useLsi(lsiCreatePlay.previous);
  const nextText = useLsi(lsiCreatePlay.next);

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({
      left: -scrollContainerRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({
      left: scrollContainerRef.current.clientWidth,
      behavior: "smooth",
    });
  };

 
  const handleSceneUpdate = async (sceneId) => {
    const newSceneData = prompt("Edit scene name:", "");

    if (newSceneData && window.confirm("Are you sure you want to save the changes?")) {
      try {

        await updateScene(sceneId, { name: newSceneData });
        onUpdateScene(sceneId, newSceneData); 
      } catch (error) {
        alert("Failed to update scene. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="scenes-scroll-buttons">
        <button onClick={scrollLeft} className="scenes-scroll-button" title={previousText}>
          <FaChevronLeft />
        </button>
        <button onClick={scrollRight} className="scenes-scroll-button" title={nextText}>
          <FaChevronRight />
        </button>
      </div>
      <div className="scenes-container" ref={scrollContainerRef}>
        {scenes.map((scene) => (
          <Scene
            key={scene.id}
            scene={scene}
            onUpdateScene={handleSceneUpdate}
            onDeleteScene={onDeleteScene}
          />
        ))}
      </div>
    </>
  );
};

export default CPScenesList;
