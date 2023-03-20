import { clearDB } from "../../db/functions";


export default async function botDisconnect(): Promise<void> {
  await clearDB()
    .then(() => {
      console.log("Успешно всё остановленно!")
    }).catch((error: any) => {
      console.log(error);
    })
}