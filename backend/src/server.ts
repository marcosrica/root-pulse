import app from "./app";
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`RootPulse backend server running on port ${PORT}`);
    console.log(`Health check on http://localhost:${PORT}/health`);
});

process.on('SIGTERM', () => {
    console.log("SIGTERM received");
    console.log("Shutting down server gracefully");

    process.exit(0);
})