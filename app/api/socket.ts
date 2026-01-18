import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "wss://socket2.vecnoscan.org";

export let socket: Socket;

if (typeof window !== "undefined") {
  socket = io(SOCKET_URL, {
    path: "/socket.io",
    autoConnect: true,
  });
}

export const getSocket = (): Socket | undefined => {
  return typeof window !== "undefined" ? socket : undefined;
};

export const useSocketConnected = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleConnect = () => {
      if (timeoutId !== null) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setConnected(true);
      }, 200);
    };

    const handleDisconnect = () => {
      setConnected(false);
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      if (timeoutId !== null) clearTimeout(timeoutId);
    };
  }, []);

  return { connected };
};