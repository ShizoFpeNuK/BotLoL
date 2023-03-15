import { INewUser } from "../user.model";
import { lastMatchBySummoner, summonerByName } from "../../riot/riot.request";
import { Constants, LolApi } from "twisted";
import User from "../../db/models/user.model";
import { ApiResponseDTO } from "twisted/dist/models-dto";


export default async function registerNewClient(socket: any, api: LolApi, clientInfo: INewUser) {
  await User.findByPk(clientInfo.clientId)
    .then(async (resUser) => {
      if (resUser) {
        await socket.emit("clientRegistered", {
          channelId: clientInfo.channelId,
          clientId: clientInfo.clientId,
          summonerName: resUser.dataValues.summoner_name
        });
      } else {
        await summonerByName(api, clientInfo.summonerName, Constants.Regions.RUSSIA)
          .then(async (resSummoner) => {
            if (resSummoner) {
              const summonerLastMatchId: ApiResponseDTO<string[]> | null = await lastMatchBySummoner(api, resSummoner.response.puuid, Constants.RegionGroups.EUROPE);
              await socket.emit("isNickname", {
                isNickname: true,
                channelId: clientInfo.channelId,
                clientId: clientInfo.clientId,
                summonerName: clientInfo.summonerName,
              });

              await User.create({
                client_id: BigInt(clientInfo.clientId),
                channel_id: BigInt(clientInfo.channelId),
                summoner_name: clientInfo.summonerName,
                summoner_puuid: resSummoner.response.puuid,
                match_id: summonerLastMatchId?.response[0]
              })
            } else {
              await socket.emit("isNickname", { 
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