import Sequelize from "sequelize";
import { sequelizeInstance } from '..';


export default class Rank extends Sequelize.Model {
  declare summoner_id: number;
  declare tier_solo: string;
  declare rank_solo: string;
  declare lp_solo: string;
  declare tier_flex: string;
  declare rank_flex: string;
  declare lp_flex: string;
};

Rank.init(
  {
    summoner_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    tier_solo: {
      type: Sequelize.STRING(10),
      defaultValue: 0,
    },
    rank_solo: {
      type: Sequelize.STRING(2),
      defaultValue: 0,
    },
    lp_solo: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    tier_flex: {
      type: Sequelize.STRING(10),
      defaultValue: 0,
    },
    rank_flex: {
      type: Sequelize.STRING(2),
      defaultValue: 0,
    },
    lp_flex: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  },

  { sequelize: sequelizeInstance, underscored: true, modelName: "rank" }
);