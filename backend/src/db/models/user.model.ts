import Sequelize from "sequelize";
import { sequelizeInstance } from '..';
import Rank from "./rank.model";


export default class User extends Sequelize.Model {
  declare client_id: bigint;
  declare match_id: string;
  declare summoner_name: string;
  declare summoner_puuid: string;
  declare timer_tracking_player: number;
};

User.init(
  {
    client_id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      unique: true
    },
    match_id: {
      type: Sequelize.STRING,
      defaultValue: null
    },
    summoner_name: {
      type: Sequelize.STRING,
    },
    summoner_puuid: {
      type: Sequelize.STRING(78),
    },
    timer_tracking_player: {
      type: Sequelize.INTEGER,
      defaultValue: null,
      unique: true
    },
  },

  { sequelize: sequelizeInstance, underscored: true, modelName: "user" }
);

console.log(sequelizeInstance.models);
Rank;