import { INewUser } from "../../user.model";
import { Socket as SocketServer } from "socket.io"; 
import User from "../../../db/models/user.model";


export default async function checkForRegistration(socket: SocketServer, clientInfo: INewUser): Promise<boolean> {
  return new Promise<boolean>(async (resolve, reject) => {
    await User.findByPk(clientInfo.clientId)
      .then((resUser: User | null) => {
        if (resUser) {
          socket.emit("clientRegistered", {
            channelId: clientInfo.channelId,
            clientId: clientInfo.clientId,
            summonerName: resUser.dataValues.summoner_name
          });
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((error) => {
        reject("Error: Не найден User");
      })
  })
}