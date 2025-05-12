import express from "express";
import Users from "../collections/Users.js"; // Assuming this is your Mongoose model

const leaderBoardRouter = express.Router();

leaderBoardRouter.get('/leaderboard', async (req, res) => {
    try {
        const topPlayers = await Users.find() // Changed from Player to Users
            .sort({ totalScore: -1 }) 
            .limit(5)
            .select('userName totalScore')
            .lean(); // Convert Mongoose documents to plain JS objects
        
        res.status(200).json({
            success: true,
            data: topPlayers
        });
    } catch (err) {
        console.error('Leaderboard error:', err);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch leaderboard',
            error: err.message
        });
    }
});

export default leaderBoardRouter;