import React, { useEffect, useState } from "react";
import SceneFigure from "./components/create-play/SceneFigure";

const sceneFigure = () => {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [figures, setFigures] = useState([
    { id: 1, name: "Figure 1", assignedUser: "" },
    { id: 2, name: "Figure 2", assignedUser: "" },
  ]);

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/actor/list");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        // Assuming data.actorList is the correct response structure
        if (data && Array.isArray(data.actorList)) {
          setUsersList(data.actorList);
        } else {
          throw new Error("Invalid data format from backend");
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAssignUser = (figureId, userId) => {
    setFigures((prev) =>
      prev.map((fig) => (fig.id === figureId ? { ...fig, assignedUser: userId } : fig))
    );
  };

  const handleDeleteFigure = (figureId) => {
    setFigures((prev) => prev.filter((fig) => fig.id !== figureId));
  };

  if (loading) return <div>Loading actors...</div>;
  if (error) return <div>Error loading actors: {error}</div>;

  return (
    <div>
      {figures.map((figure) => (
        <SceneFigure
          key={figure.id}
          figure={figure}
          usersList={usersList}
          onAssignUser={handleAssignUser}
          onDeleteFigure={handleDeleteFigure}
        />
      ))}
    </div>
  );
};

export default sceneFigure;
