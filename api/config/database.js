import { Sequelize } from "sequelize";
import path from "path";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(process.cwd(), "database.sqlite"), // SQLite file location
  logging: false, // Disable logging
});

export default sequelize;
