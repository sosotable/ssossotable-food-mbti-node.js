"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
const mysql = require("mysql2/promise");
require("dotenv").config({ path: "../.env" });
module.exports = () => {
  return {
    init: (database) =>
      __awaiter(void 0, void 0, void 0, function* () {
        const config = new (require("../config/db_info").db_info)(database);
        return mysql.createPool({
          host: config.host,
          port: config.port,
          user: config.user,
          password: config.password,
          database: config.database,
        });
      }),
    open: (connection) =>
      __awaiter(void 0, void 0, void 0, function* () {
        connection.connect((err) => {
          if (err) {
            console.error("mysql connection error :" + err);
          } else {
            console.info("mysql is connected successfully.");
          }
        });
      }),
  };
};
