require("dotenv").config();

const base = {
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT) || 5432,
  dialect: process.env.DATABASE_DIALECT || "postgres",
};

module.exports = {
  development: {
    ...base,
    dialectOptions: {
      ssl: { require: false, rejectUnauthorized: false },
    },
  },
  production: {
    ...base,
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
    },
  },
  test: {
    ...base,
    dialectOptions: {
      ssl: { require: false, rejectUnauthorized: false },
    },
  },
};
