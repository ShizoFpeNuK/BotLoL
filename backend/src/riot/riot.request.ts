import { MatchQueryV5DTO } from 'twisted/dist/models-dto/matches/query-v5/match-query-v5.dto';
import { Constants, LolApi } from 'twisted';
import { RegionGroups, Regions } from 'twisted/dist/constants';
import { ApiResponseDTO, MatchV5DTOs, SummonerLeagueDto, SummonerV4DTO } from 'twisted/dist/models-dto';

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

export async function lastMatchBySummoner(api: LolApi, puuid: string, region: RegionGroups): Promise<ApiResponseDTO<string[]> | null> {
  try {
    return await api.MatchV5.list(puuid, region, query);
  }
  catch (error) {
    return null;
  }
}

export async function resultMatchByMatchId(api: LolApi, matchId: string, region: RegionGroups): Promise<ApiResponseDTO<MatchV5DTOs.MatchDto> | null> {
  try {
    return await api.MatchV5.get(matchId, region);
  }
  catch (error) {
    return null;
  }
}

export async function leagueByEncryptedSummonerId(api: LolApi, encryptedSummonerId: string): Promise<ApiResponseDTO<SummonerLeagueDto[]> | null> { //добавить тест
  try {
    return await api.League.bySummoner(encryptedSummonerId, Constants.Regions.RUSSIA);
  } catch (error) {
    return null;
  }
}