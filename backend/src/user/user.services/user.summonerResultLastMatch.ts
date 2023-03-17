import { IMatchInfo } from '../user.model';
import { Constants, LolApi } from 'twisted';
import { ApiResponseDTO, MatchV5DTOs } from 'twisted/dist/models-dto';
import { lastMatchBySummoner, resultMatchByMatchId } from '../../riot/riot.request';


export default function summonerResultLastMatch(api: LolApi, summonerPUUID: string, lastMatchId: string): Promise<IMatchInfo> { //matchId == null?
  return new Promise<IMatchInfo>(async (resolve, reject) => {
    await lastMatchBySummoner(api, summonerPUUID, Constants.RegionGroups.EUROPE)
      .then(async (resLastMatch: ApiResponseDTO<string[]> | null) => {
        if (resLastMatch) {
          const summonerLastMatch: string | undefined = resLastMatch?.response[0];
          if (summonerLastMatch !== lastMatchId) {
            await resultMatchByMatchId(api, summonerLastMatch, Constants.RegionGroups.EUROPE)
              .then((resMatch: ApiResponseDTO<MatchV5DTOs.MatchDto> | null) => {
                if (resMatch?.response) {
                  for (let i = 0; i < resMatch?.response.info.participants.length; i++) {
                    if (summonerPUUID === resMatch?.response.info.participants[i].puuid) {
                      resolve({
                        resultLastMatch: resMatch?.response.info.participants[i].win,
                        matchId: summonerLastMatch
                      })
                      break;
                    }
                  }
                }
              })
              .catch((error) => {
                console.log(error)
              })
          }
        }
      })
  })
}