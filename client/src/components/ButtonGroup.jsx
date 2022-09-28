import React from "react";
import axios from "axios";
import { useCanvasContext } from "../context/CanvasContext";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import "../css/ButtonGroup.css";
import { useEffect, useState } from "react";
import { useSocketContext } from "../context/SocketContext";

const getBase64StringFromDataURL = (dataURL) =>
  dataURL.replace("data:", "").replace(/^.+,/, "");

const ButtonGroup = ({ socket }) => {
  const navigate = useNavigate();
  const { canvasRef } = useCanvasContext();
  const [roomNumber, setRoomNumber] = useState(null);

  const handleSendMessage = () => {
    const dataURL = canvasRef.current.toDataURL();
    const base64Image = getBase64StringFromDataURL(dataURL);
    socket.emit("send-message", base64Image, roomNumber);
  };

  const handleExecuteCommand = async () => {
    const dataURL = canvasRef.current.toDataURL();
    const imageBase64 = getBase64StringFromDataURL(dataURL);
    axios
      .post("http://localhost:8080/invite-agent", {
        base64Image: imageBase64,
        currentURL: window.location.href,
      })
      .then((response) => {
        const { roomNumber } = response.data;
        if (roomNumber) {
          navigate(roomNumber);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleClearText = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(
      0,
      0,
      canvasRef.current.offsetWidth,
      canvasRef.current.offsetHeight
    );
  };

  useEffect(() => {
    setRoomNumber(window.location.pathname.substring(1));
    socket.emit("join-room", roomNumber);
  }, []);

  return (
    <div className="btn-container">
      <button onClick={handleExecuteCommand}>Execute Command</button>
      <button onClick={handleSendMessage}>Send Message</button>
      <button onClick={handleClearText}>Clear Text</button>
    </div>
  );
};

export default ButtonGroup;
