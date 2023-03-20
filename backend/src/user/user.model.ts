export interface IUser {
  clientId: string,
  channelId: string,
}

export interface INewUser extends IUser {
  summonerName: string,
}


export interface IRegistrationInfo {
  clientId: string,
  summonerName: string,
  summonerPUUID: string,
}


export interface IMatchInfo {
  resultLastMatch: boolean,
  matchId: string,
  recreated: boolean,
}