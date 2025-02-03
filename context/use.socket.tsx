"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { toast } from "sonner";

type SocketContextType = Socket | null;

// Create a context to provide the socket instance globally
export const SocketContext = createContext<SocketContextType>(null);

// URL of the server (use your actual server URL)
const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_URL; // Change this to your server's URL

export const SocketProvider = ({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;
    const socketInstance = io(SOCKET_SERVER_URL, {
      query: { userId: userId as string },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
    });

    socketInstance.on("notification", (data) => {
      toast.success(data?.text);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    // Cleanup when the component unmounts
    return () => {
      socketInstance.disconnect();
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

// Custom hook to use the socket
export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    console.log("useSocket must be used within a SocketProvider");
  }
  return socket;
};
