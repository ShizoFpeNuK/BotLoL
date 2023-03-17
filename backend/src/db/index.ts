import { Sequelize } from "sequelize";

export const sequelizeInstance = new Sequelize("BotLoL", "root", "root",{
    dialect: "postgres",
    host: "localhost",
    port: 5432,
});

export const initDB: () => Promise<void> = async () => {
    try {
        await sequelizeInstance.authenticate();
        await sequelizeInstance.sync();
        console.log("Sequelize was initialized");
    } catch (error) {
        console.log("Sequelize ERROR (initDB)", error);
        process.exit();
    }
};