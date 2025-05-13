import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../sockets";
import "../Style-files/joiningRoomStyle.css";

function RoomPage() {
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [joiningRoom, setJoiningRoom] = useState(false);

  const token = localStorage.getItem("TimerToken");
  const userName = localStorage.getItem("Username");
  const [leaderboard, setLeaderboard] = useState([]); // Simple array stat

  useEffect(() => {
    if (!token || !userName) {
      navigate("/");
      return;
    }

    return () => {
      socket.off("roomValid");
    };
  }, [navigate, token, userName]);



  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000); 

      return () => clearTimeout(timer); 
    }
  }, [error]);


const handleCreateRoom = () => {
  setCreatingRoom(true);
  setError("");

  if (!userName || !token) {
    setError("Authentication missing");
    setCreatingRoom(false);
    navigate("/");
    return;
  }

  const newRoomId = generateRoomId();
  
  if (!socket.connected) {
    setError("Unable to connect to the server. Please try again later.");
    setCreatingRoom(false);
    return;
  }

  socket.emit("createRoom", {
    roomId: newRoomId,
    userName,
    token,
  });

 
  socket.on("error", (errorMessage) => {
    setError(errorMessage || "An error occurred while creating the room.");
    setCreatingRoom(false);
  });

  sessionStorage.setItem("joinedRoom", "true");

 
  socket.on("roomCreated", () => {
    navigate(`/Gamepage/${newRoomId}`);
    setCreatingRoom(false);
  });
};


  
  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("http://localhost:5000/lb/leaderboard");
      const data = await response.json();

      if (data.success) {
        setLeaderboard(data.data);
        console.log(leaderboard); 
      }
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const handleJoinRoom = () => {
    if (!roomId.trim()) {
      setError("Typing is hard, huh?");
      return;
    }

    setJoiningRoom(true);
    setError("");

    socket.emit("checkRoom", roomId);

    const timeoutId = setTimeout(() => {
      setError(
        "Oopsie, the room didn’t feel like connecting. Try again, maybe?"
      );
      setJoiningRoom(false);
      socket.off("roomValid");
    }, 4000);

    const roomValidListener = (isValid) => {
      clearTimeout(timeoutId);
      setJoiningRoom(false);

      if (isValid) {
        sessionStorage.setItem("joinedRoom", "true");
        navigate(`/Gamepage/${roomId}`);
      } else {
        setError("Room does not exist or is full.");
      }

      socket.off("roomValid", roomValidListener);
    };

    socket.on("roomValid", roomValidListener);

    return () => {
      clearTimeout(timeoutId);
      socket.off("roomValid", roomValidListener);
    };
  };

  const generateRoomId = () => {
    return `room-${Math.random().toString(36).substr(2, 9)}`;
  };

  return (
    <div className="lobby-container">

      <div className="lobby-header">
        
        <p>Make a room, or crash someone else’s. Either way, let’s go!</p>
      </div>

   
      <div className="top-center-actions">
        <button
          className="action-btn create-btn"
          onClick={handleCreateRoom}
          disabled={creatingRoom || joiningRoom}
        >
          {creatingRoom ? "Creating..." : "Create Room"}
        </button>

        <div className="join-container">
          <input
            type="text"
            value={roomId}
            onChange={(e) => {
              setRoomId(e.target.value);
              setError("");
            }}
            placeholder="Enter room code......"
            className="room-input"
          />
          <button
            className="action-btn join-btn"
            onClick={handleJoinRoom}
            disabled={joiningRoom || creatingRoom}
          >
            {joiningRoom ? "Joining..." : "Join Room"}
          </button>
        </div>
      </div>


      {error && <div className="error-message">⚠️ {error}</div>}

   
      <div className="grid-content">
        
     
        <div className="content-card instructions">
          <h2 className="section-title">Things to Know</h2>
          <div className="divider"></div>
         <ul className="rules-list" style={{ textTransform: "none" }}>
        <li>Points are awarded based on difficulty: <span style={{ color: "green" }}>Easy</span> = 1 point, <span style={{ color: "yellow" }}>Medium</span> = 2 points, <span style={{ color: "red" }}>Hard</span> = 3 points.</li>
        <li>A 12-second timer is set for each question.</li>
        <li>The game begins once both players have joined the room and clicked <span style={{ color: "orange" }}>Ready</span>.</li>
        <li>The leaderboard displays the top players, with total scores added after each game.</li>
        <li>Questions are sourced from a predefined list of movies.</li>
        <li>There may be some delay between questions due to API latency, so please have some patience.</li>
       <li>Room ID must be manually copied and pasted. Future updates may include an auto-copy feature.</li>

      </ul>

        </div>
         <div className="content-card leaderboard-wrapper">
          <h2 className="section-title">LEADERBOARD</h2>
          <div className="divider"></div>
          <div className="leaderboard">
            {leaderboard.map((player, index) => (
              <div className="player-row" key={player._id}>
                <span className="rank">{index + 1}</span>
                <div className="player-info">
                  <span className="username">{player.userName}</span>
                </div>
                <span className="score">{player.totalScore}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomPage;
