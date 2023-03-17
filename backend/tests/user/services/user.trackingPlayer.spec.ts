import { IUser } from '../../../src/user/user.model';
import { LolApi } from 'twisted';
import { assert } from 'chai';
import { describe } from 'mocha';
import { io, Socket as SocketClient } from 'socket.io-client';
import { Server, Socket as SockerServer } from 'socket.io';
import { summonerDisableTrackingPlayer, summonerEnableTrackingPlayer } from '../../../src/user/services/user.trackingPlayer';
import User from '../../../src/db/models/user.model';
import * as dotenv from 'dotenv';
dotenv.config();


const api: LolApi = new LolApi({ key: process.env.ApiKey });
const correctSummonerPUUID: string = "vggdP7RnOjaVfahyJpwGDG21uWhf9lSMsuHpXpo0pa4pvJ3aWiKlo6YSv-SUM59wKXH36LpX0MHfAQ";
const uncorrectSummonerPUUID: string = "vggdP7RnOjaVfahyJpwGDG21uWhf9lSMs";
const lastMatchId: string = "RU_342441";
const clientInfoTrue: IUser = {
  clientId: '102930931931',
  channelId: '3131481748401871',
}

describe("Тест функции отслеживания игрока summonerEnableTrackingPlayer", () => {
  let server: Server;
  let clientSocket: SocketClient;

  before(async () => {
    return new Promise(async (resolve) => {
      server = new Server(4001);
      server.on("connection", async (socket: SockerServer) => {
        socket.on("enableTrackingPlayer", async (clientInfo: IUser) => {
          await summonerEnableTrackingPlayer(socket, api, clientInfo);
        })
        socket.on("disableTrackingPlayer", async (clientInfo: IUser) => {
          await summonerDisableTrackingPlayer(socket, clientInfo);
        })
      })
      clientSocket = io('ws://localhost:4001');

      await User.create({
        client_id: '102930931931',
        summoner_name: 'ShiZoFreNuK',
      }).then(() => {
        resolve();
      })
    })
  })

  afterEach(() => {
    clientSocket.emit("disableTrackingPlayer", clientInfoTrue);
  })

  after(async () => {
    return new Promise(async (resolve) => {
      clientSocket.close();
      server.close();

      await User.destroy({
        truncate: true
      }).then(() => {
        resolve();
      })
    })
  })


  it("Возвращает false, если игрок ещё не отслеживается", async function () {
    this.timeout(2000);
    return new Promise(async (resolve) => {
      clientSocket.emit("enableTrackingPlayer", clientInfoTrue);
      clientSocket.once("playerAlreadyTracked", (noTrackedPlayer: any) => {
        console.log(noTrackedPlayer.isTracked);
        assert.isFalse(noTrackedPlayer.isTracked);
        setTimeout(resolve, 1000);
      })
    })
  })

  // Дописать тесты

})