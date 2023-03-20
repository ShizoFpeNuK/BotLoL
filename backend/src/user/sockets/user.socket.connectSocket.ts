import { LolApi } from 'twisted';
import { clearDB } from '../../db/functions';
import { INewUser, IUser } from '../user.model';
import { DisconnectReason, Server, Socket as SockerServer } from 'socket.io';
import { summonerDisableTrackingPlayer, summonerEnableTrackingPlayer } from '../services/trackingPlayer';
import updateClient from '../services/updateClient';
import registerNewClient from '../services/registerNewClient';
import botDisconnect from '../services/botDisconnect';


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

    socket.on("updateClient", async (clientInfo: INewUser) => { //Нужен ли?
      await updateClient(socket, api, clientInfo);
    })

    socket.on("disconnect", async (reason: DisconnectReason) => {
      await botDisconnect();
      console.log(reason);
    });
  })
}