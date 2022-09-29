import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import io from "socket.io-client";
import { useSocketContext } from "../context/SocketContext";
import "../css/ChatScreen.css";

const ChatScreen = ({ socket }) => {
  const [chatRoomNumber, setChatRoomNumber] = useState(
    window.location.pathname.substring(1)
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    setChatRoomNumber(window.location.pathname.substring(1));
    socket.emit("join-room", chatRoomNumber);
  }, [window.location.href]);

  useEffect(() => {
    setChatRoomNumber(window.location.pathname.substring(1));
    socket.emit("join-room", chatRoomNumber);
    socket.on("receive-message", (message) => {
      setMessage(message);
    });
  }, []);

  return (
    <section className="chat-screen">
      <h3>Chat room number #{chatRoomNumber}</h3>
      <p>{message}</p>
    </section>
  );
};

export default ChatScreen;
