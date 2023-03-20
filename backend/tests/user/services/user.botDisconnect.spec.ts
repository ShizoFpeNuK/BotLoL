import { Op } from "sequelize";
import { IUser } from '../../../src/user/user.model';
import { LolApi } from 'twisted';
import { assert } from 'chai';
import { describe } from 'mocha';
import { io, Socket as SocketClient } from 'socket.io-client';
import { DisconnectReason, Server, Socket as SocketServer } from "socket.io";
import { summonerDisableTrackingPlayer, summonerEnableTrackingPlayer } from "../../../src/user/services/trackingPlayer";
import User from '../../../src/db/models/user.model';
import botDisconnect from '../../../src/user/services/botDisconnect';

const api: LolApi = new LolApi({ key: process.env.ApiKey });

const clientInfo1: IUser = {
  clientId: '102930931931',
  channelId: '3131481748401871',
}
const clientInfo2: IUser = {
  clientId: '102930931932',
  channelId: '3131481748401871',
}
const clientInfo3: IUser = {
  clientId: '102930931933',
  channelId: '3131481748401871',
}


describe("Тест функции botDisconnect, когда бот резко отключается", () => {
  let server: Server;
  let clientSocket: SocketClient;

  before(function () {
    this.timeout(11000);
    server = new Server(4001);
    server.on("connection", async (socket: SocketServer) => {
      socket.on("enableTrackingPlayer", async (clientInfo: IUser) => {
        await summonerEnableTrackingPlayer(socket, api, clientInfo);
      })
      socket.on("disableTrackingPlayer", async (clientInfo: IUser) => {
        await summonerDisableTrackingPlayer(socket, clientInfo);
      })
      socket.on("disconnect", async (reason: DisconnectReason) => {
        botDisconnect();
        console.log(reason);
      });
    })
    clientSocket = io('ws://localhost:4001');

    return new Promise(async (resolve) => {
      await User.destroy({
        truncate: true
      }).then(async () => {
        await User.create({
          client_id: "102930931931",
        }).then(async () => {
          await User.create({
            client_id: "102930931932",
          }).then(async () => {
            await User.create({
              client_id: "102930931933",
            }).then(() => {
              clientSocket.emit("enableTrackingPlayer", clientInfo1);
              clientSocket.emit("enableTrackingPlayer", clientInfo2);
              clientSocket.emit("enableTrackingPlayer", clientInfo3);
              console.log("Начали отслеживание");
              setTimeout(resolve, 6000);
            })
          })
        })
      })
    })
  })

  beforeEach(function (done) {
    this.timeout(5000);
    clientSocket.close();
    console.log("Закрываем бота");
    setTimeout(done, 4000)
  })

  after(async () => {
    return new Promise(async (resolve) => {
      server.close();

      await User.destroy({
        truncate: true
      }).then(() => {
        resolve();
      })
    })
  })


  it("Возвращает пустой массив клиентов, которые не включили функцию отслеживания", async function () {
    this.timeout(6000);
    console.log("Начали тест");
    return new Promise(async (resolve) => {
      await User.findAll({
        where: {
          [Op.not]: [{
            timer_tracking_player: null
          }]
        }
      }).then(async (findUser: User[]) => {
        assert.deepEqual(findUser, []);
        setTimeout(resolve, 5000)
      })
    })
  })
})