const mysql = require("mysql2/promise");
const path = require("path");
require("dotenv").config({ path: "../../../.env" });

module.exports = () => {
  return {
    init: async () => {
      return mysql.createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: "ssossotest",
      });
    },
  };
};
