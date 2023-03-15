export interface IUser {
  clientId: string,
  channelId: string,
}

export interface INewUser extends IUser {
  summonerName: string,
}


export interface IMatchInfo {
  resultLastMatch: boolean,
  matchId: string,
}