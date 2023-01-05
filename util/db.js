const Sequelize = require("sequelize");
const { DATABASE_URL } = require("./config");

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    useUTC: false,
    timezone: "+02:00",
  },
  timezone: "+02:00",
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    //await sequelize.query("SET timezone = '+02:00';", { raw: true });
    console.log("connected to the database");
  } catch (err) {
    console.log(err);
    console.log("failed to connect to the database");
    return process.exit(1);
  }
  return null;
};

module.exports = { connectToDatabase, sequelize };
