import { INewUser, IUser } from '../user.model';
import { Constants, LolApi } from 'twisted';
import { ApiResponseDTO, SummonerV4DTO } from 'twisted/dist/models-dto';
import { Server, Socket as SockerServer } from 'socket.io';
import { lastMatchBySummoner, summonerByName } from '../../riot/riot.request';
import { summonerDisableTrackingPlayer, summonerEnableTrackingPlayer } from '../services/user.trackingPlayer';
import User from '../../db/models/user.model';
import registerNewClient from '../services/user.registerNewClient';


export default function connectSocket(server: Server, api: LolApi) {
  server.on("connection", (socket: SockerServer) => {
    socket.emit("connectBot", socket.id);
    
    socket.on("registerClient", async (clientInfo: INewUser) => {
      await registerNewClient(socket, api, clientInfo);
    })

    socket.on("enableTrackingPlayer", async (clientInfo: IUser) => {
      await summonerEnableTrackingPlayer(socket, api, clientInfo);
    })

    socket.on("disableTrackingPlayer", async (clientInfo: IUser) => {
      await summonerDisableTrackingPlayer(socket, clientInfo);
    })

    socket.on("updateClient", async (api: LolApi, clientInfo: INewUser) => {
      await User.findByPk(clientInfo.clientId)
        .then(async (resUser: User | null) => {
          await summonerByName(api, clientInfo.summonerName, Constants.Regions.RUSSIA)
            .then(async (resSummoner: ApiResponseDTO<SummonerV4DTO> | null) => {
              await lastMatchBySummoner(api, resUser?.dataValues.summoner_puuid, Constants.RegionGroups.EUROPE)
                .then(async (resLastMatch: ApiResponseDTO<string[]> | null) => {
                  await resUser?.update({
                    summoner_name: clientInfo.summonerName,
                    summoner_puuid: resSummoner?.response.puuid,
                    timer_tracking_player: null,
                    match_id: resLastMatch?.response[0],
                })
              })
            })
        })
        .catch((error) => {
          console.log(error);
        })
    })
  })
}