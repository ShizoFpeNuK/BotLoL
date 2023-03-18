import { LolApi } from "twisted";
import { clientNoRegisted } from "../sockets/user.socket.functions";
import { IMatchInfo, IUser } from "../user.model";
import { Socket as SocketServer } from "socket.io";
import User from "../../db/models/user.model";
import summonerResultLastMatch from "./user.summonerResultLastMatch";


const timeRequestRiot: number = 10000;

export async function summonerEnableTrackingPlayer(socket: SocketServer, api: LolApi, clientInfo: IUser): Promise<void> {
  await User.findByPk(clientInfo.clientId)
    .then(async (resUser: User | null) => {
      if (resUser) {
        if (!resUser.dataValues.timer_tracking_player) {
          socket.emit("playerAlreadyTracked", {
            isTracked: false,
            channelId: clientInfo.channelId,
            clientId: clientInfo.clientId,
          })
          const timerTrackingPlayerId: NodeJS.Timer = setInterval(async () =>
            await summonerResultLastMatch(api, resUser.dataValues.summoner_puuid, resUser.dataValues.match_id)
              .then(async (resLastMatch: IMatchInfo) => {
                await resUser.update({
                  match_id: resLastMatch.matchId,
                }).then(() => {
                  socket.emit("summonerResultPlayedMatch", {
                    win: resLastMatch.resultLastMatch,
                    channelId: clientInfo.channelId,
                    clientId: clientInfo.clientId,
                  });
                }).catch((error) => {
                  console.log(error);
                })
              })
              .catch((error) => {
                console.log(error);
              }),
            timeRequestRiot);

          await resUser.update({
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

export async function summonerDisableTrackingPlayer(socket: SocketServer, clientInfo: IUser): Promise<void> {
  await User.findByPk(clientInfo.clientId)
    .then(async (resUser: User | null) => {
      if (resUser) {
        socket.emit("playerNoTracked", {
          channelId: clientInfo.channelId,
          clientId: clientInfo.clientId,
        })

        clearInterval(resUser.dataValues.timer_tracking_player);
        await resUser.update({
          timer_tracking_player: null,
        }).then(() => {
        }).catch((error) => {
          console.log(error);
        })
      } else {
        clientNoRegisted(socket, clientInfo);
      }
    })
    .catch((error) => {
      console.log(error);
    })
}