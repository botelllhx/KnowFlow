require("dotenv").config();
const { Sequelize } = require("sequelize");

const isProduction = process.env.NODE_ENV === "production";
const sslDisabled =
  process.env.DATABASE_SSL === "false" || process.env.DATABASE_SSL === "0";

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: process.env.DATABASE_DIALECT || "postgres",
    port: parseInt(process.env.PGPORT) || 5432,
    logging: false,
    ...(isProduction &&
      !sslDisabled && {
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      }),
  }
);

module.exports = sequelize;
