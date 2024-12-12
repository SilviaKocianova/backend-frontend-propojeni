// rehearsalList-Modal.js
import React, { useEffect, useState } from "react";
import CPModal from "./components/create-play/CPModal";

const rehearsalList = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [playsList, setPlaysList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch plays (rehearsals) from the backend
  useEffect(() => {
    const fetchPlays = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/rehearsal/list");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        // Assuming data.rehearsalList contains the list of plays
        if (data && Array.isArray(data.rehearsalList)) {
          setPlaysList(data.rehearsalList);
        } else {
          throw new Error("Invalid data format from backend");
        }
      } catch (err) {
        console.error("Error fetching plays:", err);
        setError(err.message);
      } finally {
        setLoading(false);
        console.log("Plays fetched from backend:", playsList); // Log the fetched plays
      }
    };

    fetchPlays();
  }, []);

  const handleSelectPlay = (playId) => {
    console.log("Selected play ID:", playId);
    // Additional logic when a play is selected can go here
  };

  return (
    <div>
      <button onClick={() => setModalOpen(true)}>Open Modal</button>
      {loading ? (
        <div>Loading plays...</div>
      ) : error ? (
        <div>Error loading plays: {error}</div>
      ) : (
        <CPModal
          isOpen={isModalOpen}
          playsList={playsList}
          onSelectPlay={handleSelectPlay}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default rehearsalList;
