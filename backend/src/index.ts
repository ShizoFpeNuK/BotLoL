import { Server } from 'socket.io';
import { LolApi } from 'twisted';
import { initDB } from './db';
import connectSocket from './user/user.sockets/user.socket.main';


initDB();

const ServerPort: number = Number(process.env.ServerPort) || 5000;
export const server = new Server(ServerPort);
export const apiRequestRiot = new LolApi({ key: process.env.ApiKey });

connectSocket(server, apiRequestRiot);