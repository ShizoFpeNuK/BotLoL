import { LolApi } from "twisted";
import { Socket as SocketServer } from "socket.io";
import { INewUser, IRegistrationInfo } from "../user.model";
import User from "../../db/models/user.model";
import checkForRegistration from "./functions/checkForRegistration";
import searchSummoner from "./functions/searchSummoner";


export default async function registerNewClient(socket: SocketServer, api: LolApi, clientInfo: INewUser): Promise<void> {
  await checkForRegistration(socket, clientInfo)
    .then(async (isRegistration: boolean) => {
      if (!isRegistration) {
        await searchSummoner(socket, api, clientInfo)
          .then(async (createdUser: IRegistrationInfo | null) => {
            if (createdUser) {
              await User.create({
                client_id: BigInt(createdUser.clientId),
                summoner_name: createdUser.summonerName,
                summoner_puuid: createdUser.summonerPUUID,
              })
            }
          })
          .catch((error) => {
            console.log(error);
          })
      }
    })
    .catch((error) => {
      console.log(error);
    })
}

