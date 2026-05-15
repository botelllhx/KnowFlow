require("dotenv").config();

const base = {
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT) || 5432,
  dialect: process.env.DATABASE_DIALECT || "postgres",
};

/** Postgres local (Docker) não usa SSL; Azure/RDS costumam exigir. */
const productionUsesSsl =
  process.env.DATABASE_SSL !== "false" && process.env.DATABASE_SSL !== "0";

module.exports = {
  development: {
    ...base,
    dialectOptions: {
      ssl: { require: false, rejectUnauthorized: false },
    },
  },
  production: {
    ...base,
    ...(productionUsesSsl && {
      dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false },
      },
    }),
  },
  test: {
    ...base,
    dialectOptions: {
      ssl: { require: false, rejectUnauthorized: false },
    },
  },
};
