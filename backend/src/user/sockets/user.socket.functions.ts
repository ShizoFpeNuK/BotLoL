import { IUser } from "../user.model";
import { Socket as SocketServer } from "socket.io";

export function clientNoRegisted(socket: SocketServer, clientInfo: IUser) {
  socket.emit("clientNoRegisted", {
    channelId: clientInfo.channelId,
    clientId: clientInfo.clientId,
  })
}