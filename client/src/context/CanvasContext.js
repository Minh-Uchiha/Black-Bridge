import React, { useContext, useRef, useState } from "react";

const CanvasContext = React.createContext();

export const CanvasProvider = ({ children }) => {
  const [canvasRef, setCanvasRef] = useState(null);

  return (
    <CanvasContext.Provider value={{ setCanvasRef, canvasRef }}>
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvasContext = () => {
  return useContext(CanvasContext);
};
