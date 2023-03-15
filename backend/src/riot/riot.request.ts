import { LolApi } from 'twisted';
import { MatchQueryV5DTO } from 'twisted/dist/models-dto/matches/query-v5/match-query-v5.dto';
import { RegionGroups, Regions } from 'twisted/dist/constants';
import { ApiResponseDTO, SummonerV4DTO } from 'twisted/dist/models-dto';

const query: MatchQueryV5DTO = {
  // start: 3,
  count: 1,
}

export async function summonerByName(api: LolApi, summonerName: string, region: Regions): Promise<ApiResponseDTO<SummonerV4DTO> | null> {
  try {
    return await api.Summoner.getByName(summonerName, region);
  }
  catch (error) {
    return null;
  }
}

export async function lastMatchBySummoner(api: LolApi, puuid: string, region: RegionGroups) {
  try {
    return await api.MatchV5.list(puuid, region, query);
  }
  catch (error) {
    return null;
  }
}

export async function resultMatchByMatchId(api: LolApi, matchId: string, region: RegionGroups) {
  try {
    return await api.MatchV5.get(matchId, region);
  }
  catch (error) {
    console.log(`Нет никакой информации о матче ${matchId}`);
  }
}