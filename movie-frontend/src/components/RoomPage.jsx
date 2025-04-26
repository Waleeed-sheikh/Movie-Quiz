import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../sockets";

function RoomPage() {
    const [roomId, setRoomId] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem("TimerToken");
    const userName = localStorage.getItem("Username");

    useEffect(() => {
     
        if (!token || !userName) {
            navigate('/');
            return;
        }

        
        return () => {
            socket.off("roomValid"); 
        };
    }, [navigate, token, userName]);

    const handleCreateRoom = () => {
        setLoading(true);

        if (!userName || !token) {
            setError("Authentication missing");
            setLoading(false);
            navigate('/');
            return;
        }

        const newRoomId = generateRoomId();
        socket.emit("createRoom", { 
            roomId: newRoomId,
            userName,
            token 
        });

        sessionStorage.setItem("joinedRoom", "true");
        navigate(`/Gamepage/${newRoomId}`);
        setLoading(false);
    };

    const handleJoinRoom = () => {
        if (!roomId.trim()) {
            setError("Please enter a valid room ID");
            return;
        }

        setLoading(true);
        socket.emit("checkRoom", roomId);

        const roomValidListener = (isValid) => {
            setLoading(false); 
            if (isValid) {
                sessionStorage.setItem("joinedRoom", "true");
                navigate(`/Gamepage/${roomId}`);
            } else {
                setError("Room does not exist.");
            }

            
            socket.off("roomValid", roomValidListener);
        };

        
        socket.on("roomValid", roomValidListener);
    };

    const generateRoomId = () => {
        return `room-${Math.random().toString(36).substr(2, 9)}`;
    };

    return (
        <div>
            <h1>Game Lobby</h1>

            <div>
                <button 
                    onClick={handleCreateRoom} 
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create Room"}
                </button>
            </div>

            <div>
                <input
                    type="text"
                    value={roomId}
                    onChange={(e) => {
                        setRoomId(e.target.value);
                        setError("");
                    }}
                    placeholder="Enter Room ID"
                />
                <button 
                    onClick={handleJoinRoom} 
                    disabled={loading || !roomId.trim()}
                >
                    {loading ? "Joining..." : "Join Room"}
                </button>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default RoomPage;
   



