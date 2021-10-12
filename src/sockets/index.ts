import { io } from "socket.io-client";

export const socket = io(process.env.BASE_SOCKET_URL as string);
