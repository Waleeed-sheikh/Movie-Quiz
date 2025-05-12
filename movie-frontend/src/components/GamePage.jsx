import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../sockets";
import copy from "../icons/copy.png"
import GameOverScreen from "./GameOver";
import "../Style-files/gamePageStyle.css";
function GamePage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const [gameStatus, setGameStatus] = useState({
    isStarted: false,
    isEnded: false,
    countdown: null,
  });
  const [players, setPlayers] = useState([]);
  const [scores, setScores] = useState([]);
  const [answeredPlayers, setAnsweredPlayers] = useState([]);
  const [readyPlayers, setReadyPlayers] = useState([]);
  const [error, setError] = useState("");


  const [question, setQuestion] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const token = localStorage.getItem("TimerToken");
  const userName = localStorage.getItem("Username");


  const isPlayerReady = readyPlayers.includes(socket.id);
  const currentQuestionNumber = question ? question.questionNumber : 0;
  const totalQuestions = question ? question.totalQuestions : 0;

  
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      socket.off();
    };
  }, []);

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
      setPlayers(state.players);
      setScores(state.scores || []);
      setQuestion(state.currentQuestion);
      if (state.timeRemaining) {
        setTimeRemaining(Math.floor(state.timeRemaining / 1000));
      }
    };

    const handlePlayersUpdate = (playerList) => {
      setPlayers(playerList);
      if (scores.length === 0) {
        setScores(playerList.map((p) => ({ userName: p.userName, score: 0 })));
      }
    };

    const handlePlayerReadyUpdate = ({ readyPlayers }) => {
      setReadyPlayers(readyPlayers);
    };

    const handleGameStart = () => {
      setGameStatus((prev) => ({ ...prev, isStarted: true, countdown: null }));
    };

    const handleNewQuestion = (questionData) => {
      setQuestion(questionData);
      setSelectedAnswer(null);
      startQuestionTimer();
    };

    const handleCountdown = (count) => {
      setGameStatus((prev) => ({ ...prev, countdown: count }));
    };

    const handlePlayerAnswered = ({ userName }) => {
      setAnsweredPlayers((prev) => [...new Set([...prev, userName])]);
    };
    

    const handleGameEnded = (finalScores) => {
      console.log("handleGameEnded called", finalScores);

      
      const scoresArray = Array.isArray(finalScores.scores)
        ? finalScores.scores
        : [finalScores.scores];

      socket.emit("gameEnded", {
        roomId,
        finalScores: scoresArray.map((s) => ({
          userName: s.userName,
          score: s.score,
        })),
      });

      setGameStatus((prev) => ({ ...prev, isEnded: true }));
      setScores(finalScores.scores);
      clearInterval(timerRef.current);
    };

    const handleAuthError = () => {
      localStorage.removeItem("TimerToken");
      navigate("/");
    };


    socket.on("waitingForOpponent", () =>
      setError("Waiting for opponent to get ready...")
    );
    socket.on("playerIsReady", ({ userName }) =>
      setError(`${userName} is ready!`)
    );
    socket.on("roomValid", handleRoomValid);
    socket.on("gameStateUpdate", handleGameStateUpdate);
    socket.on("playersjoined", handlePlayersUpdate);
    socket.on("playerReadyUpdate", handlePlayerReadyUpdate);
    socket.on("gameStarted", handleGameStart);
    socket.on("sendQuestion", handleNewQuestion);
    socket.on("countdown", handleCountdown);
    socket.on("scoreUpdate", setScores);
    socket.on("playerAnswered", handlePlayerAnswered);
    socket.on("gameEnded", handleGameEnded);
    socket.on("questionError", (error) => {
      console.error("Question error:", error);
      setError("Failed to load question. Trying again...");
    });
    socket.on("auth_error", handleAuthError);
    socket.on("connect_error", (err) => {
      if (err.message === "Authentication Error") handleAuthError();
    });

    socket.emit("checkRoom", roomId);

    return () => {
      const events = [
        "waitingForOpponent",
        "playerIsReady",
        "roomValid",
        "gameStateUpdate",
        "playersjoined",
        "playerReadyUpdate",
        "gameStarted",
        "sendQuestion",
        "countdown",
        "scoreUpdate",
        "playerAnswered",
        "gameEnded",
        "questionError",
        "auth_error",
        "connect_error",
      ];
      events.forEach((event) => socket.off(event));
    };
  }, [roomId, navigate, token, userName]);

  const startQuestionTimer = () => {
    setAnsweredPlayers([]);
    clearInterval(timerRef.current);
    setTimeRemaining(10);

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    socket.emit("sendAnswer", { roomId, answer });
    setAnsweredPlayers((prev) => [...new Set([...prev, userName])]);
  };

  const handleReadyClick = () => {
    socket.emit("playerReady", { roomId });
  };

  const getDifficultyColor = () => {
    if (!question) return "";
    switch (question.difficulty) {
      case "Easy":
        return "green";
      case "Medium":
        return "orange";
      case "Hard":
        return "red";
      default:
        return "";
    }
  };

  const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); 
    })
    .catch((err) => {
      console.error("Failed to copy!", err);
    });
};


  if (gameStatus.isEnded) {
    return <GameOverScreen scores={scores} currentUserName={userName} />;
  }
return (
  <div className={`game-container ${gameStatus.isStarted ? 'game-started' : ''}`}>

    <h1 className="center-text">
  You are in the Room: <span className="room-id">{roomId}</span>
  <button onClick={() => copyToClipboard(roomId)} className="copy-btn">
  <img className="img" src={copy} alt="Copy Room ID" />
</button>
  {copySuccess && <span className="copy-message fade-in">Copied Room-ID!</span>}
</h1>

    <div className="flex-space">
      <div className="section">
        <h2>Players:</h2>
        <ul>
          {players.map((player) => (
            <li key={player.id} className="player-item">
              {player.userName}
              {answeredPlayers.includes(player.userName) && " ✓"}
            </li>
          ))}
        </ul>
      </div>

      <div className="section">
  <h2>Scores:</h2>
  <ul>
    {scores.map((player, index) => (
      <li key={index} className="player-item">
            <span className="player-name">{player.userName}:   </span>  
            <span className="player-score" style={{marginLeft:"5px"}}>  {player.score}  pts</span>
            </li>

    ))}
  </ul>
</div>

    </div>

    {!gameStatus.isStarted && (
      <div>
        {!isPlayerReady ? (
          <button onClick={handleReadyClick} className="ready-button">
            I'm Ready!
          </button>
        ) : (
          <div className="ready-status" >
            {readyPlayers.length === 1 ? (
              <h2>Waiting for opponent to join & get ready...</h2>
            ) : (
              <h2>Both players ready! Game starting soon...</h2>
            )}
          </div>
        )}
      </div>
    )}

    {gameStatus.countdown !== null && (
      <h2 className="countdown">
        Game starts in... {gameStatus.countdown}
      </h2>
    )}

    {gameStatus.isStarted && question && (
      <div className="fade-in">
        <div className="question-number" >
          Question <span style={{color:"white", }}>{currentQuestionNumber}</span> of {totalQuestions}
        </div>

        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{
              width: `${(timeRemaining / 10) * 100}%`,
              backgroundColor: timeRemaining <= 3 ? "red" : "#4caf50",
            }}
          />
        </div>

        <div className="question-header">
          <h3 style={{fontSize:"29px", fontWeight: "100",fontFamily:"Bebas Neue', sans-serif"}}>Question:</h3>
          <span
            style={{
              color: getDifficultyColor(),
              fontSize:"29px", fontWeight: "100",
              fontFamily:"Bebas Neue', sans-serif",
            }}
          >
            {question.difficulty?.toUpperCase()}
          </span>
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: "100",
              fontFamily:"Bebas Neue', sans-serif",
              color: timeRemaining <= 3 ? "red" : "inherit",
              margin: "10px 0",
            }}
          >
            {timeRemaining}s
          </div>
        </div>

        <p className="question-text">{question.question}</p>

        <div className="options-grid">
          {question.options.map((option, index) => {
            const isCorrect = question.correctAnswer === option;
            const isSelected = selectedAnswer === option;
            const showCorrectness = timeRemaining <= 0;

            let className = "option-button ";
            if (showCorrectness && isCorrect) className += "option-correct";
            else if (showCorrectness && isSelected && !isCorrect)
              className += "option-wrong";
            else if (isSelected) className += "option-selected";
            else className += "option-default";

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={timeRemaining <= 0}
                className={className}
              >
                {option}
                {showCorrectness && isCorrect && " ✓"}
                {showCorrectness && isSelected && !isCorrect && " ✗"}
              </button>
            );
          })}
        </div>
      </div>
    )}

    {gameStatus.isStarted && !question && <p>Loading questions......</p>}
  </div>
);


}



export default GamePage;