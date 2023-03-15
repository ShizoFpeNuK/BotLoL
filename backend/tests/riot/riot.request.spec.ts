import { assert } from 'chai';
import { describe } from 'mocha';
import { Constants, LolApi } from 'twisted';
import { lastMatchBySummoner, summonerByName } from '../../src/riot/riot.request'

const apiRequestRiot = new LolApi({ key: process.env.ApiKey });
const correctNickname = 'ShiZoFreNuK';
const uncorrectNickname = '1';
const correctSummonerPUUID = '0spdyKCmypuVf1mTYmCD6Qn2z7azFo4GpLitnKUJu6wB1OTI_E65O-8ZjjrS0-UJhgssmH2-tQRtcg';
const uncorrectSummonerPUUID = '1'

describe("Тест API Riot", () => {

  describe("summonerByName", () => {
    it("Возвращение объекта при существующем имени", async () => {
      await summonerByName(apiRequestRiot, correctNickname, Constants.Regions.RUSSIA)
        .then((res) => assert.isObject(res));
    })

    it("Возвращение null при несуществующем имени", async () => {
      await summonerByName(apiRequestRiot, uncorrectNickname, Constants.Regions.RUSSIA)
        .then((res) => assert.isNull(res));
    })
  })

  describe("lastMatchBySummoner", () => {
    it("Возвращение объекта при существующем puuid", async () => {
      await lastMatchBySummoner(apiRequestRiot, correctSummonerPUUID, Constants.RegionGroups.EUROPE)
        .then((res) => assert.isObject(res));
    })

    it("Возвращение null при несуществующем puuid", async () => {
      await lastMatchBySummoner(apiRequestRiot, uncorrectSummonerPUUID, Constants.RegionGroups.EUROPE)
        .then((res) => assert.isNull(res));
    })
  })

  describe("lastMatchBySummoner", () => {
    it("Возвращение объекта при существующем puuid", async () => {
      await lastMatchBySummoner(apiRequestRiot, correctSummonerPUUID, Constants.RegionGroups.EUROPE)
        .then((res) => assert.isObject(res));
    })

    it("Возвращение null при несуществующем puuid", async () => {
      await lastMatchBySummoner(apiRequestRiot, uncorrectSummonerPUUID, Constants.RegionGroups.EUROPE)
        .then((res) => assert.isNull(res));
    })
  })

})