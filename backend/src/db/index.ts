import { Sequelize } from "sequelize";

export const sequelizeInstance = new Sequelize(process.env.DATABASE_NAME!, process.env.DATABASE_USERNAME!, process.env.DATABASE_PASSWORD!, {
  dialect: "postgres",
  host: "localhost",
  port: 5432,
  // logging: false,
});

export async function initDB(): Promise<void> {
  try {
    await sequelizeInstance.authenticate();
    await sequelizeInstance.sync();
    console.log("Sequelize was initialized");
  } catch (error) {
    console.log("Sequelize ERROR (initDB)", error);
    process.exit();
  }
};