import Sequelize from "sequelize";
import { sequelizeInstance } from '..';

export default class User extends Sequelize.Model { }

User.init(
  {
    client_id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      unique: true
    },
    match_id: {
      type: Sequelize.STRING,
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
    },
  },

  { sequelize: sequelizeInstance, underscored: true, modelName: "user" }
);