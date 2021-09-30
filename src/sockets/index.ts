import SocketClient from "socket.io-client";

export const socket = SocketClient(process.env.BASE_SOCKET_URL as string);
