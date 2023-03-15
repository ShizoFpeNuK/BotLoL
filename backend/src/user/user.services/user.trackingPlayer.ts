import { LolApi } from "twisted";
import User from "../../db/models/user.model";
import { INewUser, IUser } from "../user.model";
import { clientNoRegisted } from "../user.sockets/user.socket.functions";
import summonerResultLastMatch from "./user.summonerResultLastMatch";


const timeRequestRiot: number = 10000;

export async function summonerEnableTrackingPlayer(socket: any, api: LolApi, clientInfo: IUser) {
  await User.findByPk(clientInfo.clientId)
    .then(async (resUser) => {
      if (resUser) {
        if (!resUser?.dataValues.timer_tracking_player) {
          socket.emit("playerAlreadyTracked", {
            isTracked: false,
            channelId: clientInfo.channelId,
            clientId: clientInfo.clientId,
          })
          
          const timerTrackingPlayerId: NodeJS.Timer = setInterval(async () =>
            await summonerResultLastMatch(api, resUser?.dataValues.summoner_puuid, resUser?.dataValues.match_id)
              .then(async (resLastMatch) => {
                await socket.emit("summonerResultPlayedMatch", {
                  win: resLastMatch.resultLastMatch,
                  channelId: clientInfo.channelId,
                  clientId: clientInfo.clientId,
                });
                await resUser?.update({
                  match_id: resLastMatch.matchId,
                })
              })
              .catch((error) => {
                console.log(error);
              }),
            timeRequestRiot);

          await resUser?.update({
            timer_tracking_player: timerTrackingPlayerId[Symbol.toPrimitive](),
          })
        } else {
          socket.emit("playerAlreadyTracked", {
            isTracked: true,
            channelId: clientInfo.channelId,
            clientId: clientInfo.clientId,
          })
        }
      } else {
        clientNoRegisted(socket, clientInfo);
      }
    })
    .catch((error) => {
      console.log(error);
    })
}

export async function summonerDisableTrackingPlayer(socket: any, clientInfo: IUser) {
  await User.findByPk(clientInfo.clientId)
    .then(async (resUser) => {
      if (resUser) {
        socket.emit("playerNoTracked", {
          channelId: clientInfo.channelId,
          clientId: clientInfo.clientId,
        })
        clearInterval(resUser?.dataValues.timer_tracking_player);
        await resUser?.update({
          timer_tracking_player: null,
        })
      } else {
        clientNoRegisted(socket, clientInfo);
      }
    })
    .catch((error) => {
      console.log(error);
    })
}