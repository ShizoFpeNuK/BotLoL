import { Server } from 'socket.io';
import { LolApi } from 'twisted';
import { initDB } from './db';
import { clearDB } from './db/functions';
import connectSocket from './user/sockets/user.socket.connectSocket';


initDB().then(() => {clearDB()});

const ServerPort: number = Number(process.env.ServerPort!);
const server = new Server(ServerPort);
const apiRequestRiot = new LolApi({ key: process.env.ApiKey });

connectSocket(server, apiRequestRiot);