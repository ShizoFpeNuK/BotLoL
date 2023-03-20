import { summonerByName } from "../../../riot/riot.request";
import { Constants, LolApi } from "twisted";
import { Socket as SockerServer } from 'socket.io';
import { INewUser, IRegistrationInfo } from "../../user.model";
import { ApiResponseDTO, SummonerV4DTO } from "twisted/dist/models-dto";
import { summonerExists, summonerNoExists } from "../../sockets/user.socket.functions";


export default async function searchSummoner(socket: SockerServer, api: LolApi, clientInfo: INewUser): Promise<IRegistrationInfo | null> {
  return new Promise<IRegistrationInfo | null>(async (resolve, reject) => {
    await summonerByName(api, clientInfo.summonerName, Constants.Regions.RUSSIA)
      .then((summoner: ApiResponseDTO<SummonerV4DTO> | null) => {
        if (summoner) {
          summonerExists(socket, clientInfo);
          resolve({
            clientId: clientInfo.clientId,
            summonerName: clientInfo.summonerName,
            summonerPUUID: summoner.response.puuid,
          });
        } else {
          summonerNoExists(socket, clientInfo);
          resolve(null);
        }
      })
      .catch((error) => {
        reject("Error: Проблема в summonerByName");
      })
  })
}