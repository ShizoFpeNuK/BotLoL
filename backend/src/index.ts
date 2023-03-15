import { Server } from 'socket.io';
import { LolApi } from 'twisted';
import connectSocket from './user/user.sockets/user.socket.main';
const { initDB } = require('./db');


const ServerPort: number = Number(process.env.ServerPort) || 4000;
initDB();

const io = new Server(ServerPort);
const apiRequestRiot = new LolApi({key: process.env.ApiKey});
connectSocket(io, apiRequestRiot);