import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useCanvasContext } from "../context/CanvasContext";
import "../css/Canvas.css";

const Canvas = ({ width, height }) => {
  // Get canvasRef from CanvasContext
  const { setCanvasRef } = useCanvasContext();

  // Reference to canvas
  const isMouseDown = useRef(false);
  const canvasRef = useRef(null);
  const ctx = useRef(null);

  const handleWritingInProcess = (e) => {
    e.preventDefault();
    if (isMouseDown.current) {
      const point = {
        x:
          (e.x || e.touches[0].clientX) -
          canvasRef.current.getBoundingClientRect().left,
        y:
          (e.y || e.touches[0].clientY) -
          canvasRef.current.getBoundingClientRect().top,
      };
      ctx.current.lineTo(point.x, point.y);
      ctx.current.stroke();
    }
  };

  const handleWritingStart = (e) => {
    e.preventDefault();
    const point = {
      x:
        (e.x || e.touches[0].clientX) -
        canvasRef.current.getBoundingClientRect().left,
      y:
        (e.y || e.touches[0].clientY) -
        canvasRef.current.getBoundingClientRect().top,
    };
    ctx.current.beginPath();
    ctx.current.lineWidth = 4;
    ctx.current.moveTo(point.x, point.y);
    isMouseDown.current = true;
  };

  const handleWritingEnd = (e) => {
    e.preventDefault();
    if (isMouseDown) {
      ctx.current.stroke();
    }
    isMouseDown.current = false;
  };

  // Set up event listenters
  useEffect(() => {
    if (canvasRef) {
      setCanvasRef(canvasRef);

      canvasRef.current.addEventListener("mousedown", handleWritingStart);
      canvasRef.current.addEventListener("touchstart", handleWritingStart);
      canvasRef.current.addEventListener("mouseup", handleWritingEnd);
      canvasRef.current.addEventListener("touchend", handleWritingEnd);

      ctx.current = canvasRef.current.getContext("2d");

      // Update the cursor position
      window.addEventListener("mousemove", handleWritingInProcess);
      window.addEventListener("touchmove", handleWritingInProcess);
    }
  }, []);

  return <canvas width={width} height={height} ref={canvasRef}></canvas>;
};

export default Canvas;
