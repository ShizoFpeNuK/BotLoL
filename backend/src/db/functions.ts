import { Op } from "sequelize";
import User from "./models/user.model";


export async function clearDB(): Promise<void> {
  await User.findAll({
    where: {
      [Op.not]: [{
        timer_tracking_player: null
      }]
    }
  }).then(async (findUser: User[]) => {
    findUser.forEach(async (user: User) => {
      await user.update({
        timer_tracking_player: null
      })
    })
  })

  console.log("Обнулены требуемые значения в БД.")
}