const mysql = require("mysql2/promise");
require("dotenv").config({ path: "../.env" });

module.exports = () => {
  return {
    init: async (database: String) => {
      const config = new (require("../config/db_info").db_info)(database);
      return mysql.createPool({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database,
      });
    },
    open: async (connection: any) => {
      connection.connect((err: Error) => {
        if (err) {
          console.error("mysql connection error :" + err);
        } else {
          console.info("mysql is connected successfully.");
        }
      });
    },
  };
};
