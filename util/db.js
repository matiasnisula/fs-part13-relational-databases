const Sequelize = require("sequelize");
const { DATABASE_URL } = require("./config");
const { Umzug, SequelizeStorage } = require("umzug");

const types = require("pg").types;
const TIMESTAMPTZ_ID = 1184;

const setTimezoneToTimestamp = () => {
  types.setTypeParser(TIMESTAMPTZ_ID, (value) => {
    return new Date(value + "-0200");
  });
};
setTimezoneToTimestamp();

const sequelize = new Sequelize(DATABASE_URL);

const migrationConf = {
  migrations: {
    glob: "migrations/*.js",
  },
  storage: new SequelizeStorage({ sequelize, tableName: "migrations" }),
  context: sequelize.getQueryInterface(),
  logger: console,
};

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf);

  const migrations = await migrator.up();
  console.log("Migrations up to date", {
    files: migrations.map((mig) => mig.name),
  });
};

const rollbackMigration = async () => {
  await sequelize.authenticate();
  const migrator = new Umzug(migrationConf);
  await migrator.down();
};

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    //await sequelize.query("SET timezone = 'Europe/Helsinki';", { raw: true });
    console.log("connected to the database");
  } catch (err) {
    console.log("failed to connect to the database");
    console.log(err);
    return process.exit(1);
  }
  return null;
};

module.exports = { connectToDatabase, sequelize, rollbackMigration };
