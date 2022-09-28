const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const axios = require("axios");
require("dotenv").config();

const url = `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`;
const PORT = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

// Listening to incoming socket requests
io.on("connection", (socket) => {
  console.log("Connected!" + socket.id);

  socket.on("send-message", async (base64Image, room) => {
    const result = await axios.post(url, {
      requests: [
        {
          image: {
            content: base64Image,
          },
          features: [
            {
              type: "DOCUMENT_TEXT_DETECTION",
              maxResults: 1,
            },
          ],
        },
      ],
    });
    const message = result.data.responses[0].fullTextAnnotation.text;
    console.log(message, room);
    socket.to(room).emit("receive-message", message);
  });

  socket.on("join-room", (room) => {
    console.log(room, "fdsf");
    socket.join(room);
  });
});

// Enable necessary middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const inviteRoutes = require("./routes/Invite");
app.use("/invite-agent", inviteRoutes);

server.listen(PORT, () => console.log("Currently listening to", PORT));
