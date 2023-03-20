import { IMatchInfo } from '../../user.model';
import { Constants, LolApi } from 'twisted';
import { ApiResponseDTO, MatchV5DTOs } from 'twisted/dist/models-dto';
import { lastMatchBySummoner, resultMatchByMatchId } from '../../../riot/riot.request';


export default async function summonerResultLastMatch(api: LolApi, summonerPUUID: string, lastMatchId: string): Promise<IMatchInfo> {
  return new Promise<IMatchInfo>(async (resolve, reject) => {
    await lastMatchBySummoner(api, summonerPUUID, Constants.RegionGroups.EUROPE)
      .then(async (resLastMatch: ApiResponseDTO<string[]> | null) => {
        if (resLastMatch) {
          const summonerLastMatchId: string | undefined = resLastMatch.response[0];
          if (summonerLastMatchId !== lastMatchId) {
            await resultMatchByMatchId(api, summonerLastMatchId, Constants.RegionGroups.EUROPE)
              .then((resMatch: ApiResponseDTO<MatchV5DTOs.MatchDto> | null) => {
                if (resMatch?.response) {
                  for (let i = 0; i < resMatch.response.info.participants.length; i++) {
                    if (summonerPUUID === resMatch.response.info.participants[i].puuid) {
                      resolve({
                        recreated: resMatch.response.info.participants[i].gameEndedInEarlySurrender, //Внести
                        resultLastMatch: resMatch.response.info.participants[i].win,
                        matchId: summonerLastMatchId,
                      })
                      break;
                    }
                  }
                }
              })
              .catch((error) => {
                console.log(error);
              })
          }
        } else {
          reject("Нет сыгранных матчей или игрока не существует!")
        }
      })
      .catch((error) => {
        console.log(error);
      })
  })
}