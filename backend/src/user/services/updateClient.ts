import { LolApi } from 'twisted';
import { clientNoRegisted } from '../sockets/user.socket.functions';
import { Socket as SockerServer } from 'socket.io';
import { INewUser, IRegistrationInfo } from '../user.model';
import User from '../../db/models/user.model';
import searchSummoner from './functions/searchSummoner';


export default async function updateClient(socket: SockerServer, api: LolApi, clientInfo: INewUser): Promise<void> { //Добавить тест
  await User.findByPk(clientInfo.clientId)
    .then(async (resUser: User | null) => {
      if (resUser) {
        if (resUser.dataValues.summoner_puuid) {
          console.log("Запустили очистку");
          clearInterval(resUser.dataValues.timer_tracking_player);
        }
        console.log("Обновляем клиента");
        await searchSummoner(socket, api, clientInfo)
          .then(async (createdUser: IRegistrationInfo | null) => {
            if (createdUser) {
              await resUser.update({
                summoner_name: createdUser.summonerName,
                summoner_puuid: createdUser.summonerPUUID,
                timer_tracking_player: null,
                match_id: null,
              })
            }
          })
          .catch((error) => {
            console.log(error);
          })
      } else {
        clientNoRegisted(socket, clientInfo);
      }
    })
    .catch((error) => {
      console.log(error);
    })
}