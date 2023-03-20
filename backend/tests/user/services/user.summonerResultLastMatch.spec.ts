import { LolApi } from 'twisted';
import { assert } from 'chai';
import { describe } from 'mocha';
import { IMatchInfo } from '../../../src/user/user.model';
import summonerResultLastMatch from "../../../src/user/services/functions/summonerResultLastMatch";
import * as dotenv from 'dotenv';
dotenv.config();


const api: LolApi = new LolApi({ key: process.env.ApiKey });
const correctSummonerPUUID: string = "vggdP7RnOjaVfahyJpwGDG21uWhf9lSMsuHpXpo0pa4pvJ3aWiKlo6YSv-SUM59wKXH36LpX0MHfAQ";
const uncorrectSummonerPUUID: string = "vggdP7RnOjaVfahyJpwGDG21uWhf9lSMs";
const lastMatchId: string = "RU_342441";

describe("Тест функции получения информации о новом (только что сыгранном) матче summonerResultLastMatch", () => {
  it("Возвращение объекта IMatchInfo при корректных данных", async () => {
    return new Promise(async (resolve) => {
      await summonerResultLastMatch(api, correctSummonerPUUID, lastMatchId)
        .then((matchInfo: IMatchInfo) => {
          assert.isObject(matchInfo);
          resolve();
        })
    })
  })

  it("Возвращение объекта IMatchInfo при некорректном summonerPUUID", async () => {
    return new Promise(async (resolve) => {
      await summonerResultLastMatch(api, uncorrectSummonerPUUID, lastMatchId)
        .catch((res: string) => {
          assert.equal(res, "Нет сыгранных матчей или игрока не существует!");
          resolve();
        })
    })
  })
})