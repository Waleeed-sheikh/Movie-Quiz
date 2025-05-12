import React from "react";
import "../Style-files/gameOverStyles.css"
import { useNavigate } from "react-router-dom";

export default function GameOverScreen({ scores, currentUserName }) {
  const highestScore = Math.max(...scores.map((p) => p.score));
  const navigate=useNavigate();
  
  const winners = scores.filter(p => p.score === highestScore);
  const isDraw = winners.length > 1;
  const isWinner = isDraw ? false : scores.some(
    (p) => p.userName === currentUserName && p.score === highestScore
  );

  const getTitleClass = () => {
    if (isDraw) return "game-over-title draw-title";
    return isWinner ? "game-over-title winner-title" : "game-over-title loser-title";
  };

  const getScoreClass = (score) => {
  if (score === highestScore) {
    return isDraw ? "score-item draw-score" : "score-item winner-score";
  }
  return "score-item loser-score"; 
};

 
  return (
    <div className="game-over-screen">
      <h1 className={getTitleClass()}>
        {isDraw ? "It's a draw! Or as we call it in diplomacy—'let’s pretend we’re all happy'." : isWinner ? " You won. Somewhere, a slow clap just began. " : "You gave it your all—and your all gave up. You lost."}
      </h1>

      <h2 className="title">Final Scores</h2>
      <ul className="final-scores">
        {scores
          .sort((a, b) => b.score - a.score)
          .map((player, index) => (
            <li
              key={index}
              className={getScoreClass(player.score)}
            >
              {index + 1}. {player.userName}: {player.score} points
              {player.score === highestScore }
            </li>
          ))}
      </ul>

      <button
        onClick={() => navigate("/Room")}
        className="play-again-btn"
      >
        Play Again
      </button>
    </div>
  );
}