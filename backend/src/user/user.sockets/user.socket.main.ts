import { INewUser, IUser } from '../user.model';
import { Server } from 'socket.io';
import { Constants, LolApi } from 'twisted';
import { lastMatchBySummoner, summonerByName } from '../../riot/riot.request';
import { summonerDisableTrackingPlayer, summonerEnableTrackingPlayer } from '../user.services/user.trackingPlayer';
import User from '../../db/models/user.model';
import registerNewClient from '../user.services/user.registerNewClient';


export default async function connectSocket(io: Server, api: LolApi) {
  await io.on("connection", async (socket: any) => {
    await socket.emit("connection", socket.id);

    await socket.on("registerClient", async (clientInfo: INewUser) => {
      registerNewClient(socket, api, clientInfo);
    })

    await socket.on("enableTrackingPlayer", async (clientInfo: IUser) => {
      summonerEnableTrackingPlayer(socket, api, clientInfo);
    })

    await socket.on("disableTrackingPlayer", async (clientInfo: IUser) => {
      summonerDisableTrackingPlayer(socket, clientInfo);
    })

    await socket.on("updateClient", async (api: LolApi, clientInfo: INewUser) => {
      await User.findByPk(clientInfo.clientId)
        .then(async (resUser) => {
          await summonerByName(api, clientInfo.summonerName, Constants.Regions.RUSSIA)
            .then(async (resSummoner) => {
              await lastMatchBySummoner(api, resUser?.dataValues.summoner_puuid, Constants.RegionGroups.EUROPE)
                .then(async (resLastMatch) => {
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