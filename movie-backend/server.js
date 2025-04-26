import express from "express"
import cors from "cors"
import {createServer} from "http"
import {Server} from "socket.io"
import connectDB from "./db.js"
import quotesRouter from "./Routes/QuotesRoutes.js";
import userRouter from './Routes/UserRoutes.js'
import questionRouter from "./Routes/QuestionRoutes.js";
import axios from "axios"
import jwt from "jsonwebtoken"

const SECRET_key="SECRET-KEY"

const app=express(); 
const server=createServer(app);
const io= new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods: ["GET", "POST"],
    },
})

app.use(cors())
app.use(express.json())

connectDB();

app.use("/quotes",quotesRouter)
app.use("/users",userRouter)
app.use("/questions",questionRouter)


const activeRooms={};



io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  
  if (!token) {
    console.log("No token provided");
    return next(new Error("Authentication Error"));
  }

  try {
    const decoded = jwt.verify(token, SECRET_key);
    socket.user = {
      id: decoded.id,      
      username: decoded.username
    };
    next();
  } catch (error) {
    console.log("Invalid Token", error);
    return next(new Error("Authentication Error"));
  }
});


io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);
  console.log("Handshake details: ", socket.handshake); 
  
  socket.on("checkRoom", (roomId) => {
    console.log(`Room check triggered for roomId: ${roomId}`);
    const roomExists = Object.prototype.hasOwnProperty.call(activeRooms, roomId);
    socket.emit("roomValid", roomExists);
  });

  
  socket.on("createRoom", ({ roomId }) => {
    if (!socket.user) {
      return socket.emit("auth_error", "Not authenticated");
    }
  
    if (activeRooms[roomId]) {
      return socket.emit("error", "Room already exists");
    }
  
    activeRooms[roomId] = {
      players: [{
        id: socket.user.id,
        socketId: socket.id,
        userName: socket.user.username,
        score: 0, 
        currentAnswer: null 
      }],
      readyPlayers: new Set(),
      gameStarted: false,
      timer: null,
      currentQuestion: null,
      creator: socket.user.id,
      questionTimer: null, 
      answeredPlayers: new Set(),
      scoredAnswers: new Set(), 
      questionStartTime: null 
    };



    socket.join(roomId);
    socket.emit("roomCreated", roomId);
    io.to(roomId).emit("playersjoined", activeRooms[roomId].players);
  });


  socket.on("joinRoom", async ({ roomId }) => {
    if (!socket.user) {
      return socket.emit("auth_error", "Not authenticated");
    }
  
    if (!activeRooms[roomId]) {
      return socket.emit("error", "Room does not exist");
    }
  
    socket.join(roomId);
  
    const room = activeRooms[roomId];
    const playerIndex = room.players.findIndex(p => p.id === socket.user.id);
  
    if (playerIndex === -1) {
      
      const newPlayer = {
        id: socket.user.id,
        socketId: socket.id,
        userName: socket.user.username,
        score: 0,  
        currentAnswer: null
      };
      room.players.push(newPlayer);
    } else {
      
      room.players[playerIndex].socketId = socket.id;
    }
  
    
    socket.emit("gameStateUpdate", {
      players: room.players,
      currentQuestion: room.currentQuestion,
      scores: room.players.map(p => ({ userName: p.userName, score: p.score })),
      timeRemaining: room.questionStartTime 
        ? Math.max(0, 20000 - (Date.now() - room.questionStartTime))
        : null
    });
  
    
    io.to(roomId).emit("playersjoined", room.players);
  });


  





  socket.on("playerReady", ({ roomId }) => {
    if (!activeRooms[roomId]) return;
  
  
    if (!(activeRooms[roomId].readyPlayers instanceof Set)) {
      activeRooms[roomId].readyPlayers = new Set();
    }
  
    activeRooms[roomId].readyPlayers.add(socket.id);
  
   
    io.to(roomId).emit("playerReadyUpdate", Array.from(activeRooms[roomId].readyPlayers));
  
    const totalPlayers = activeRooms[roomId].players.length;
    const readyCount = activeRooms[roomId].readyPlayers.size;
  
    console.log(`Room ${roomId} has ${readyCount}/${totalPlayers} players ready.`);
  
   
    if (totalPlayers > 1 && readyCount === totalPlayers) {
      activeRooms[roomId].gameStarted = true;
      
      
      let countdown = 3;
  
      const countdownInterval = setInterval(() => {
        io.to(roomId).emit("countdown", countdown);
        console.log(`Countdown for room ${roomId}: ${countdown}`);
        countdown--;
        if (countdown === 0) {
          clearInterval(countdownInterval);
          setTimeout(() => {
            io.to(roomId).emit("gameStarted", "Game is starting!");
            fetchMovieQuestion(roomId); 
        }, 800); 
        }
      }, 1000);
    }
  });
  


  
  socket.on("sendAnswer", ({ roomId, answer }) => {
    if (!socket.user || !activeRooms[roomId]) return;
  
    const room = activeRooms[roomId];
    const player = room.players.find(p => p.id === socket.user.id);
  
    if (!player) return;
  
   
    player.currentAnswer = answer;
    room.answeredPlayers.add(socket.id);
  
    io.to(roomId).emit("playerAnswered", {
      userName: socket.user.username,
      hasAnswered: true
    });
  
   
    if (room.answeredPlayers.size === room.players.length) {
      clearTimeout(room.questionTimer);
      endQuestion(roomId);
    }
  });


  const endQuestion = (roomId) => {
    const room = activeRooms[roomId];
    if (!room || !room.currentQuestion) return;
  
    clearTimeout(room.questionTimer);
  
   
    room.players.forEach(player => {
      const answerKey = `${player.id}-${room.currentQuestion.questionId}`;
      
 
      if (!room.scoredAnswers.has(answerKey) && 
          player.currentAnswer === room.currentQuestion.correctAnswer) {
        const points = getDifficultyPoints(room.currentQuestion.difficulty);
        player.score += points;
        room.scoredAnswers.add(answerKey);
      }
    });
  
    
    io.to(roomId).emit("scoreUpdate", 
      room.players.map(p => ({ userName: p.userName, score: p.score }))
    );
  
    room.answeredPlayers = new Set();
    room.currentQuestion = null;
    setTimeout(() => fetchMovieQuestion(roomId), 2000);
  };

  function getDifficultyPoints(difficulty) {
    return {
      easy: 1,
      normal: 2,
      difficult: 3
    }[difficulty] || 1;
  }
  

  socket.on("getTimeRemaining", ({ roomId }, callback) => {
    if (!activeRooms[roomId] || !activeRooms[roomId].questionStartTime) {
      return callback({ remaining: 0 });
    }
    
    const elapsed = Date.now() - activeRooms[roomId].questionStartTime;
    const remaining = Math.max(0, 20000 - elapsed);
    callback({ remaining });
  });



  socket.on("disconnect", () => {
    console.log(`Disconnected: ${socket.id}`);
  
    for (const roomId in activeRooms) {
      const room = activeRooms[roomId];
      const index = room.players.findIndex((p) => p.socketId === socket.id);
  
      if (index !== -1) {
        const disconnectedPlayer = room.players[index];
        room.players.splice(index, 1);
        console.log(`${disconnectedPlayer.userName} left room ${roomId}`);
  
        // Clean up timers if game is in progress
        if (room.gameStarted) {
          if (room.questionTimer) {
            clearTimeout(room.questionTimer);
            room.questionTimer = null;
          }
        }
  
        io.to(roomId).emit("playersjoined", room.players);
  
       
        if (room.players.length === 0) {
          console.log(`Room ${roomId} is now empty. Will delete in 30 seconds if no one rejoins.`);
          setTimeout(() => {
            const stillEmpty = activeRooms[roomId]?.players.length === 0;
            if (stillEmpty) {
              
              if (activeRooms[roomId].questionTimer) {
                clearTimeout(activeRooms[roomId].questionTimer);
              }
              delete activeRooms[roomId];
              console.log(`Deleting empty room ${roomId} after delay`);
            } else {
              console.log(`Room ${roomId} was repopulated. Not deleting.`);
            }
          }, 60000); 
        }
  
        break;
      }
    }
  });;});


 





  const fetchMovieQuestion = async (roomId) => {
  try {
    const response = await axios.get("http://localhost:5000/questions/getMovieQuestions");
    const room = activeRooms[roomId];
    
    
    if (room.questionTimer) clearTimeout(room.questionTimer);
    
    
    room.answeredPlayers = new Set();
    room.currentQuestion = {
      question: response.data.question,
      options: response.data.options,
      correctAnswer: response.data.correctAnswer,
      difficulty: response.data.difficulty
    };
    

    room.questionStartTime = Date.now();
    
    io.to(roomId).emit("sendQuestion", room.currentQuestion);
    
   
    room.questionTimer = setTimeout(() => {
      endQuestion(roomId);
    }, 20000);
    
  } catch (error) {
    console.log("Error fetching movie question", error);
  }
};

function getDifficultyPoints(difficulty) {
  return {
    easy: 1,
    normal: 2,
    difficult: 3
  }[difficulty] || 1;
}


const endQuestion = (roomId) => {
  const room = activeRooms[roomId];
  if (!room) return;

  clearTimeout(room.questionTimer);
  
  
  room.players.forEach(player => {
    if (player.currentAnswer === room.currentQuestion.correctAnswer) {
      const points = getDifficultyPoints(room.currentQuestion.difficulty);
      player.score += points;
    }
  });

  
  io.to(roomId).emit("scoreUpdate", 
    room.players.map(p => ({ userName: p.userName, score: p.score }))
  );

  room.answeredPlayers = new Set();
  room.currentQuestion = null;

  
  setTimeout(() => fetchMovieQuestion(roomId), 2000);
};

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));











// //xmlhttprequest , axios, fetch, promises async await 







































































