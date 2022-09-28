import { useEffect, useState, useRef } from "react";
import { Canvas, ButtonGroup, ChatScreen } from "./";
import io from "socket.io-client";
import "../css/App.css";

const socket = io.connect("http://localhost:8080/");

const MainPage = () => {
  const rootClassRef = useRef();
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth * 0.63,
    height: 560,
  });

  const handleResize = () => {
    setCanvasSize((oldCanvasSize) => {
      return {
        ...oldCanvasSize,
        width: rootClassRef.current.offsetWidth * 0.7,
        height: 560,
      };
    });
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      <h1 style={{ marginTop: "20px" }}>Draw your message</h1>
      <div className="root-class" ref={rootClassRef}>
        <Canvas width={canvasSize.width} height={canvasSize.height} />
        <ChatScreen socket={socket} />
        <ButtonGroup socket={socket} />
      </div>
    </>
  );
};

export default MainPage;
