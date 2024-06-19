import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

let socket;

export const initializeSocket = (userName) => {
    if (!socket) {
        socket = io(SOCKET_URL, {
            query: { userName }
        });
    }
    return socket;
};