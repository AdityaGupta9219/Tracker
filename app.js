const express = require('express');
const app = express();
const path = require("path");

// Socket.IO setup
const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Socket.IO connection
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("send-location", (data) => {
        console.log(`Location received from ${socket.id}:`, data);
        io.emit("receive-location", { id: socket.id, ...data });
    });

    socket.on("disconnect", () => {
        io.emit("user-disconnected", socket.id);
    });
});

// Routes
app.get("/", (req, res) => {
    res.render("index");
});

// Start server
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
