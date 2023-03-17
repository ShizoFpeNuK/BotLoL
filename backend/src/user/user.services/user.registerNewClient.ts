import { INewUser } from "../user.model";
import { Constants, LolApi } from "twisted";
import { Socket as SocketSetver } from "socket.io";
import { ApiResponseDTO, SummonerV4DTO } from "twisted/dist/models-dto";
import { lastMatchBySummoner, summonerByName } from "../../riot/riot.request";
import User from "../../db/models/user.model";


export default async function registerNewClient(socket: SocketSetver, api: LolApi, clientInfo: INewUser): Promise<void> {
  await User.findByPk(clientInfo.clientId)
    .then(async (resUser: User | null) => {
      if (resUser) {
        socket.emit("clientRegistered", { //Вынести отдельно
          channelId: clientInfo.channelId,
          clientId: clientInfo.clientId,
          summonerName: resUser.dataValues.summoner_name
        });
      } else {
        await summonerByName(api, clientInfo.summonerName, Constants.Regions.RUSSIA)
          .then(async (resSummoner: ApiResponseDTO<SummonerV4DTO> | null) => {
            if (resSummoner) {
              const summonerLastMatchId: ApiResponseDTO<string[]> | null = await lastMatchBySummoner(api, resSummoner.response.puuid, Constants.RegionGroups.EUROPE);
              socket.emit("isNickname", {
                isNickname: true,
                channelId: clientInfo.channelId,
                clientId: clientInfo.clientId,
                summonerName: clientInfo.summonerName,
              });

              await User.create({
                client_id: BigInt(clientInfo.clientId),
                summoner_name: clientInfo.summonerName,
                summoner_puuid: resSummoner.response.puuid,
                match_id: summonerLastMatchId?.response[0]
              })
            } else {
              socket.emit("isNickname", { 
                isNickname: false, 
                channelId: clientInfo.channelId, 
                clientId: clientInfo.clientId, 
                summonerName: clientInfo.summonerName,
              });
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