import { IUser } from "../user.model";

export function clientNoRegisted(socket: any, clientInfo: IUser) {
  socket.emit("clientNoRegisted", {
    channelId: clientInfo.channelId,
    clientId: clientInfo.clientId,
  })
}