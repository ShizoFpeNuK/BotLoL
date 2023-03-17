import { assert } from 'chai';
import { describe } from 'mocha';
import { Constants, LolApi } from 'twisted';
import { ApiResponseDTO, MatchV5DTOs, SummonerV4DTO } from 'twisted/dist/models-dto';
import { lastMatchBySummoner, resultMatchByMatchId, summonerByName } from '../../src/riot/riot.request';
import * as dotenv from 'dotenv';
dotenv.config();


const apiRequestRiot: LolApi = new LolApi({ key: process.env.ApiKey });
const correctNickname: string = 'ShiZoFreNuK';
const uncorrectNickname: string = '1';
const correctSummonerPUUID: string = '0spdyKCmypuVf1mTYmCD6Qn2z7azFo4GpLitnKUJu6wB1OTI_E65O-8ZjjrS0-UJhgssmH2-tQRtcg';
const uncorrectSummonerPUUID: string = '1'
const correctMatchId: string = 'RU_433988988';
const uncorrectMatchId: string = '';

describe("Тест API Riot", () => {

  describe("summonerByName", () => {
    it("Возвращение объекта игрока при существующем имени", async () => {
      await summonerByName(apiRequestRiot, correctNickname, Constants.Regions.RUSSIA)
        .then((res: ApiResponseDTO<SummonerV4DTO> | null) => assert.isObject(res?.response));
    })

    it("Возвращение null при несуществующем имени", async () => {
      await summonerByName(apiRequestRiot, uncorrectNickname, Constants.Regions.RUSSIA)
        .then((res: ApiResponseDTO<SummonerV4DTO> | null) => assert.isNull(res));
    })
  })

  describe("lastMatchBySummoner", () => {
    it("Возвращение массива матчей при существующем puuid", async () => {
      await lastMatchBySummoner(apiRequestRiot, correctSummonerPUUID, Constants.RegionGroups.EUROPE)
        .then((res: ApiResponseDTO<string[]> | null) => assert.isArray(res?.response));
    })

    it("Возвращение null при несуществующем puuid", async () => {
      await lastMatchBySummoner(apiRequestRiot, uncorrectSummonerPUUID, Constants.RegionGroups.EUROPE)
        .then((res: ApiResponseDTO<string[]> | null) => assert.isNull(res));
    })
  })

  describe("resultMatchByMatchId", () => {
    it("Возвращение объекта матча при существующем матче", async () => {
      await resultMatchByMatchId(apiRequestRiot, correctMatchId, Constants.RegionGroups.EUROPE)
        .then((res: ApiResponseDTO<MatchV5DTOs.MatchDto> | null) => assert.isObject(res?.response));
    })

    it("Возвращение null при несуществующем матче", async () => {
      await resultMatchByMatchId(apiRequestRiot, uncorrectMatchId, Constants.RegionGroups.EUROPE)
        .then((res: ApiResponseDTO<MatchV5DTOs.MatchDto> | null) => assert.isNull(res));
    })
  })

})