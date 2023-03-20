import { IUser } from '../../../src/user/user.model';
import { LolApi } from 'twisted';
import { assert } from 'chai';
import { describe } from 'mocha';
import { io, Socket as SocketClient } from 'socket.io-client';
import { Server, Socket as SocketServer } from 'socket.io';
import { summonerDisableTrackingPlayer, summonerEnableTrackingPlayer } from '../../../src/user/services/trackingPlayer';
import User from '../../../src/db/models/user.model';
import * as dotenv from 'dotenv';
dotenv.config();


const api: LolApi = new LolApi({ key: process.env.ApiKey });
const clientInfoTrue: IUser = {
  clientId: '102930931931',
  channelId: '3131481748401871',
}

describe("Тест функции отслеживания игрока summonerEnableTrackingPlayer", () => {
  let server: Server;
  let clientSocket: SocketClient;
  
  //Запуск сервера, создание клиента и обнуление БД
  before(async () => {
    return new Promise(async (resolve) => {
      server = new Server(4001);
      server.on("connection", async (socket: SocketServer) => {
        socket.on("enableTrackingPlayer", async (clientInfo: IUser) => {
          await summonerEnableTrackingPlayer(socket, api, clientInfo);
        })
        socket.on("disableTrackingPlayer", async (clientInfo: IUser) => {
          await summonerDisableTrackingPlayer(socket, clientInfo);
        })
      })
      clientSocket = io('ws://localhost:4001');

      await User.destroy({
        truncate: true
      }).then(() => {
        resolve();
      })
    })
  })

  //Закрытие сервера, отключение клиента и обнуление БД
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


  describe("Проверка на невыполение функций отслеживания, если пользователь не зарегистрирован", () => {
    it("Возвращает объект пользователя при включение функции отслеживания игрока", function () {
      this.timeout(4000);
      clientSocket.emit("enableTrackingPlayer", clientInfoTrue);
      return new Promise(async (resolve) => {
        clientSocket.once("clientNoRegisted", (clientInfo: IUser) => {
          assert.isObject(clientInfo, "Выполнено c ошибкой");
          setTimeout(resolve, 3000);
        })
      })
    })

    it("Возвращает объект пользователя при включение функции выключения отслеживания игрока", function () {
      this.timeout(4000);
      clientSocket.emit("disableTrackingPlayer", clientInfoTrue);
      return new Promise(async (resolve) => {
        clientSocket.once("clientNoRegisted", (clientInfo: IUser) => {
          assert.isObject(clientInfo, "Выполнено c ошибкой");
          setTimeout(resolve, 3000);
        })
      })
    })
  })


  describe("Получение результата матча при отслеживании игрока", () => {
    before(function () {
      this.timeout(5000);
      return new Promise(async (resolve) => {
        await User.create({
          client_id: "102930931931",
          summoner_name: "ShiZoFreNuK",
          match_id: "RU_342441",
          summoner_puuid: "vggdP7RnOjaVfahyJpwGDG21uWhf9lSMsuHpXpo0pa4pvJ3aWiKlo6YSv-SUM59wKXH36LpX0MHfAQ",
        }).then(() => {
          setTimeout(resolve, 4000);
        })
      })
    })

    after(function (done) {
      this.timeout(14000);
      clientSocket.emit("disableTrackingPlayer", clientInfoTrue);
      setTimeout(done, 13000);
    })

    it("Возвращает объект результата последнего матча", function () {
      this.timeout(14000);
      clientSocket.emit("enableTrackingPlayer", clientInfoTrue);
      return new Promise(async (resolve) => {
        clientSocket.once("summonerResultPlayedMatch", (resLastMatch: any) => {
          assert.isObject(resLastMatch, "Выполнено c ошибкой"); //Как правильно сделать
        })
        setTimeout(resolve, 13000);
      })
    })
  })


  describe("Проверка на отслеживание игрока", () => {
    after(function (done) {
      this.timeout(14000);
      clientSocket.emit("disableTrackingPlayer", clientInfoTrue);
      setTimeout(done, 13000);
    })

    it("Возвращает false, если игрок ещё не отслеживается", async function () {
      this.timeout(14000);
      clientSocket.emit("enableTrackingPlayer", clientInfoTrue);
      return new Promise(async (resolve) => {
        clientSocket.once("playerAlreadyTracked", (noTrackedPlayer: any) => {
          assert.isFalse(noTrackedPlayer.isTracked, "Выполнено c ошибкой");
          setTimeout(resolve, 13000);
        })
      })
    })

    it("Возвращает true, если игрок уже отслеживается", async function () {
      this.timeout(14000);
      clientSocket.emit("enableTrackingPlayer", clientInfoTrue);
      return new Promise(async (resolve) => {
        clientSocket.once("playerAlreadyTracked", (yesTrackedPlayer: any) => {
          assert.isTrue(yesTrackedPlayer.isTracked, "Выполнено c ошибкой");
          setTimeout(resolve, 13000);
        })
      })
    })
  })
})