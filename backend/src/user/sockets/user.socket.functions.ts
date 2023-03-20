import { INewUser, IUser } from "../user.model";
import { Socket as SocketServer } from "socket.io";

export function clientNoRegisted(socket: SocketServer, clientInfo: IUser | INewUser): void {
  socket.emit("clientNoRegisted", {
    channelId: clientInfo.channelId,
    clientId: clientInfo.clientId,
  });
}

export function summonerExists(socket: SocketServer, clientInfo: INewUser): void {
  socket.emit("isNickname", {
    isNickname: true,
    channelId: clientInfo.channelId,
    clientId: clientInfo.clientId,  
    summonerName: clientInfo.summonerName,
  });
}

export function summonerNoExists(socket: SocketServer, clientInfo: INewUser): void {
  socket.emit("isNickname", {
    isNickname: false,
    channelId: clientInfo.channelId,
    clientId: clientInfo.clientId,  
    summonerName: clientInfo.summonerName,
  });
}