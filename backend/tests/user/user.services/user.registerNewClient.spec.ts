import { LolApi } from 'twisted';
import { assert } from 'chai';
import { describe } from 'mocha';
import { INewUser } from '../../../src/user/user.model';
import { io, Socket as SocketClient } from "socket.io-client";
import { Server, Socket as SockerServer } from 'socket.io';
import User from '../../../src/db/models/user.model';
import registerNewClient from "../../../src/user/user.services/user.registerNewClient";
import * as dotenv from 'dotenv';
dotenv.config();


const api = new LolApi({ key: process.env.ApiKey });
const clientInfoTrue: INewUser = {
  summonerName: 'ShiZoFreNuK',
  clientId: '102930931931',
  channelId: '3131481748401871',
}
const clientInfoFalse: INewUser = {
  summonerName: '1',
  clientId: '10293093193111',
  channelId: '313148174840111871',
}


describe("Тест функции регистрации registerNewClient", () => {
  let server: Server;
  let clientSocket: SocketClient;

  before(async () => {
    return new Promise(async (resolve) => {
      server = new Server(4001);
      server.on("connection", (socket: SockerServer) => {
        socket.on("registerClient", async (clientInfo: INewUser) => {
          await registerNewClient(socket, api, clientInfo);
        })
        resolve();
      })
      clientSocket = io('ws://localhost:4001');
    })
  })

  after(async () => {
    return new Promise(async (resolve) => {
      clientSocket.close();
      server.close();

      await User.destroy({
        truncate: true
      }).then((res) => {
        resolve();
      })
    })
  })


  describe("Создание/не создание нового пользователя в зависимости от корректности никнейма", () => {
    beforeEach(async () => {
      return new Promise(async (resolve) => {
        await User.destroy({
          truncate: true
        }).then((res) => {
          resolve();
        })
      })
    })

    it("Возвращает объект нового пользователя с корректным ником (isNickname: true)", async () => {
      return new Promise(async (resolve) => {
        clientSocket.emit("registerClient", clientInfoTrue);
        clientSocket.once("isNickname", (resNewUser: any) => {
          assert.isTrue(resNewUser.isNickname);
          resolve();
        })
      })
    })

    it("Возвращает объект нового пользователя с некорректным ником (isNickname: false)", async () => {
      return new Promise(async (resolve) => {
        clientSocket.emit("registerClient", clientInfoFalse);
        clientSocket.once("isNickname", (resNewUser: any) => {
          assert.isFalse(resNewUser.isNickname);
          resolve();
        })
      })
    })
  })


  describe("Проверка первой регистрации пользователя", () => {
    beforeEach(function (done) {
        this.timeout(5000);
        setTimeout(done, 2500);
    })

    it("Возвращает объект нового пользователя с корректным ником (isNickname: true) , если он является новым", async () => {
      return new Promise(async (resolve) => {
        clientSocket.emit("registerClient", clientInfoTrue);
        clientSocket.once("isNickname", (resNewUser: any) => {
          assert.isTrue(resNewUser.isNickname);
          resolve();
        })
      })
    })

    it("Возвращает объект старого пользователя, если он не является новым", async () => { //Не успевает взять из базы нового пользователя, который создаётся в прошлом тесте
      return new Promise(async (resolve) => {
        clientSocket.emit("registerClient", clientInfoTrue);
        clientSocket.once("clientRegistered", (resNewUser: any) => {
          assert.equal(clientInfoTrue.clientId, resNewUser.clientId);
          resolve();
        })
      })
    })
  })
})
