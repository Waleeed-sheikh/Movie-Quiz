import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../sockets";

function GamePage() {
    const [players, setPlayers] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState("");
    const [question, setQuestion] = useState(null);
    const [countdown, setCountdown] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answerSubmitted, setAnswerSubmitted] = useState(false);
    const [scores, setScores] = useState([]);
    const [answeredPlayers, setAnsweredPlayers] = useState([]);
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [readyPlayers, setReadyPlayers] = useState([]);
    const timerRef = useRef(null);

    const [gameState, setGameState] = useState({
        players: [],
        scores: [],
        currentQuestion: null,
        timeRemaining: 0
      });


    const token = localStorage.getItem("TimerToken");
    const userName = localStorage.getItem("Username");

    useEffect(() => {
        if (!socket.connected) {
            socket.auth = { token };
            socket.connect();
        }

        const joinRoomWithAuth = () => {
            socket.emit("joinRoom", { roomId, userName, token });
        };

        const handleRoomValid = (isValid) => {
            if (!isValid) {
                setError("Room expired or invalid");
                setTimeout(() => navigate("/Room"), 2000);
            } else {
                joinRoomWithAuth();
            }
        };

        const handleGameStateUpdate = (state) => {
            setGameState(state);
            setPlayers(state.players);
            setScores(state.scores);
            setQuestion(state.currentQuestion);
            if (state.timeRemaining) {
              setTimeRemaining(Math.floor(state.timeRemaining / 1000));
            }
          };

        const handlePlayerReadyUpdate = (readyList) => {
            setReadyPlayers(readyList);
        };

        const handlePlayersUpdate = (playerList) => {
            setPlayers(playerList);
            
            if (scores.length === 0) {
                setScores(playerList.map(p => ({ userName: p.userName, score: 0 })));
            }
        };

        const handleGameStart = (message) => {
            setGameStarted(true);
            setCountdown(null);
        };

        const handleNewQuestion = (question) => {
            setQuestion(question);
            setSelectedAnswer(null);
            setAnswerSubmitted(false);
            
            startQuestionTimer();
        };

        const handleCountdown = (count) => {
            setCountdown(count);
        };

        const handleScoreUpdate = (updatedScores) => {
            setScores(updatedScores);
        };

        const handlePlayerAnswered = ({ userName, hasAnswered }) => {
            setAnsweredPlayers(prev => {
                if (hasAnswered && !prev.includes(userName)) {
                    return [...prev, userName];
                }
                return prev;
            });
        };

        const startQuestionTimer = () => {
            setAnsweredPlayers([]);
            clearInterval(timerRef.current);
            

            socket.emit("getTimeRemaining", { roomId }, ({ remaining }) => {
                setTimeRemaining(Math.floor(remaining / 1000));
                
                
                timerRef.current = setInterval(() => {
                    setTimeRemaining(prev => {
                        if (prev <= 1) {
                            clearInterval(timerRef.current);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            });
        };

        const handleAuthError = () => {
            localStorage.removeItem("TimerToken");
            navigate('/');
        };
    

        socket.on("gameStateUpdate", handleGameStateUpdate);
        socket.on("connect", () => console.log("Connected to server"));
        socket.on("connect_error", (err) => {
            if (err.message === "Authentication Error") handleAuthError();
        });

        socket.on("roomValid", handleRoomValid);
        socket.on("playersjoined", handlePlayersUpdate);
        socket.on("gameStarted", handleGameStart);
        socket.on("sendQuestion", handleNewQuestion);
        socket.on("countdown", handleCountdown);
        socket.on("scoreUpdate", handleScoreUpdate);
        socket.on("playerAnswered", handlePlayerAnswered);
        socket.on("playerReadyUpdate", handlePlayerReadyUpdate);
        socket.on("auth_error", handleAuthError);

        socket.emit("checkRoom", roomId);

        return () => {
            clearInterval(timerRef.current);
            socket.off("roomValid", handleRoomValid);
            socket.off("playersjoined", handlePlayersUpdate);
            socket.off("gameStarted", handleGameStart);
            socket.off("sendQuestion", handleNewQuestion);
            socket.off("countdown", handleCountdown);
            socket.off("scoreUpdate", handleScoreUpdate);
            socket.off("playerAnswered", handlePlayerAnswered);
            socket.off("playerReadyUpdate", handlePlayerReadyUpdate);
            socket.off("gameStateUpdate", handleGameStateUpdate);
            socket.off("auth_error", handleAuthError);
            socket.off("connect_error");
        };
    }, [roomId, navigate, token, userName]);

    const handleAnswerSelect = (answer) => {
        if (answerSubmitted) return; 
        
        setSelectedAnswer(answer);
        setAnswerSubmitted(true);
        socket.emit("sendAnswer", { roomId, answer });
      };

    const handleReadyClick = () => {
        setIsReady(true);
        socket.emit("playerReady", { roomId });
    };

    const getDifficultyColor = () => {
        if (!question) return "";
        switch(question.difficulty) {
            case "easy": return "green";
            case "normal": return "orange";
            case "difficult": return "red";
            default: return "";
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Room: {roomId}</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                    <h2>Players:</h2>
                    <ul>
                        {players.map(player => (
                            <li key={player.id}>
                                {player.userName} 
                                {answeredPlayers.includes(player.userName) && " ✓"}
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h2>Scores:</h2>
                    <ul>
                        {scores.map((player, index) => (
                            <li key={index}>
                                {player.userName}: {player.score} pts
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {!isReady && !gameStarted && (
                <button onClick={handleReadyClick}>Ready</button>
            )}

            {isReady && readyPlayers.length < players.length && (
                <p>Waiting for {players.length - readyPlayers.length} more player(s) to be ready</p>
            )}

            {countdown !== null && (
                <h2 style={{ fontSize: '2rem', color: 'orange' }}>
                    Game starts in... {countdown}
                </h2>
            )}

            {gameStarted && question && (
                <div style={{ marginTop: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3>Question:</h3>
                        <span style={{ 
                            color: getDifficultyColor(),
                            fontWeight: "bold"
                        }}>
                            {question.difficulty?.toUpperCase()}
                        </span>
                        <span style={{ fontWeight: "bold" }}>
                            Time: {timeRemaining}s
                        </span>
                    </div>
                    
                    <p style={{ fontSize: "1.2rem" }}>{question.question}</p>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        {question.options && question.options.map((option, index) => (
                           <button
                           onClick={() => handleAnswerSelect(option)}
                           disabled={answerSubmitted}
                           style={{
                             backgroundColor: answerSubmitted 
                               ? (selectedAnswer === option ? "#4CAF50" : "#f1f1f1")
                               : selectedAnswer === option ? "#4CAF50" : "#f1f1f1",
                             opacity: answerSubmitted && selectedAnswer !== option ? 0.6 : 1
                           }}
                         >
                           {option}
                         </button>
                        ))}
                    </div>
                </div>
            )}

            {gameStarted && !question && (
                <p>Loading next question...</p>
            )}
        </div>
    );
}

export default GamePage;