import React, { useContext, useState } from "react";
import io from "socket.io-client";

const SocketContext = React.createContext();

export const SocketProvider = ({ children }) => {
  const socket = io.connect("http://localhost:8080/");

  const setSocketRoom = (room) => {
    socket.emit("join-room", room);
  };

  return (
    <SocketContext.Provider value={{ socket, setSocketRoom }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  return useContext(SocketContext);
};
