import React, { createContext, useState, useEffect } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const joinRoom = (userId) => {
    if (socket) {
      socket.emit("joinRoom", { userId });
    }
  };

  const sendMessage = (senderId, receiverId, message) => {
    if (socket) {
      socket.emit("sendMessage", { senderId, receiverId, message });
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("receiveMessage", ({ senderId, message }) => {
        setMessages((prev) => [...prev, { senderId, message }]);
      });
    }
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, messages, joinRoom, sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => React.useContext(SocketContext);
