import React from "react";
import { BrowserRouter ,Router,Route, Routes } from "react-router-dom";
import Login from "./Login.jsx";
import GamePage from "./GamePage.jsx";
import RoomPage from "./RoomPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
function Routing(){

    return(
        <BrowserRouter>
          <Routes>
             <Route path="/" element={<Login/>}/>
             <Route path="/Room" element={
                <ProtectedRoute>
                <RoomPage/>
                </ProtectedRoute>
                }/>
             <Route path="/Gamepage/:roomId" element={
                <ProtectedRoute>
                <GamePage/>
                </ProtectedRoute>
                }/>
          </Routes>
        </BrowserRouter>
    )
}

export default Routing