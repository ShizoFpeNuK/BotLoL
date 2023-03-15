import { lastMatchBySummoner, resultMatchByMatchId } from '../../riot/riot.request';
import { Constants, LolApi } from 'twisted';
import { IMatchInfo } from '../user.model';


export default function summonerResultLastMatch(api: LolApi, summonerPUUID: string, lastMatchId: string): Promise<IMatchInfo> { //matchId == null?
  return new Promise<IMatchInfo>((resolve, reject) => {
    lastMatchBySummoner(api, summonerPUUID, Constants.RegionGroups.EUROPE)
      .then(async (resLastMatch) => {
        if (resLastMatch) {
          const summonerLastMatch: string | undefined = resLastMatch?.response[0];
          if (summonerLastMatch !== lastMatchId) {
            await resultMatchByMatchId(api, summonerLastMatch, Constants.RegionGroups.EUROPE)
              .then(resMatch => {
                if (resMatch?.response) {
                  for (let i = 0; i < resMatch?.response.info.participants.length; i++) {
                    if (summonerPUUID === resMatch?.response.info.participants[i].puuid) {
                      resolve ({
                        resultLastMatch: resMatch?.response.info.participants[i].win, 
                        matchId: summonerLastMatch
                      })
                      break;
                    }
                  }
                }
              })
              .catch(error => console.log(error))
          }
        }
      })
  })
}