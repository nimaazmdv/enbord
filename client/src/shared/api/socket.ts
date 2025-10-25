import { io } from "socket.io-client";
import { useAuthStore } from "../stores/auth.store";

export const socket = io("http://localhost:8000", {
  auth: { token: useAuthStore.getState().token },
  withCredentials: true,
  autoConnect: false, // Connect on signin
});

export function connectSocket(token: string) {
  socket.auth = { token };
  socket.connect();
}

export function disconnectSocket() {
  socket.disconnect();
}
