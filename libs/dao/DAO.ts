import { RowDataPacket, FieldPacket, Pool } from "mysql2/promise";
const mysql_dbc = require("./config/db_connection")();

interface Post extends RowDataPacket {
  id: number;
  title: string;
  content: string;
}

class DAO {
  // MARK: singleton
  /**FIXME: node.js에서의 싱글톤 필요성?
   * 필요시 일반 클래스로 REFACTOR
   * */
  static DAOInstance: DAO;
  static connection: Pool;
  constructor() {
    // MARK: 싱글톤 객체 지정
    if (!DAO.DAOInstance) {
      DAO.DAOInstance = this;
    }
  }

  // MARK: DB 연결 설립과 해제
  async init() {
    DAO.connection = await mysql_dbc.init();
  }
  async end() {
    await DAO.connection.end();
  }
  getInstance() {
    return DAO.DAOInstance;
  }
  async insert(table: String, columns: String | undefined, values: String) {
    try {
      /** MARK:
       *  colmumns 가 undefined 키워드 즉 입력되지 않은 경우 생략하고 모든 열에 입력됨
       * */
      if (columns === undefined) {
        await DAO.connection.query(
          `INSERT INTO ` + `${table} ` + `VALUES(${values})`
        );
      } else {
        await DAO.connection.query(
          `INSERT INTO ` + `${table}(${columns}) ` + `VALUES(${values})`
        );
      }
    } catch (e) {
      console.error(e);
    }
  }
  async select(columns: String, table: String, where?: String) {
    try {
      /** MARK:
       *  where 매개변수를 입력하지 않는 경우 모든 열 검색
       * */
      if (where === undefined) {
        const [rows, fields]: [Post[], FieldPacket[]] =
          await DAO.connection.query(
            `SELECT ` + `${columns} ` + `FROM ` + `${table}`
          );
        return rows;
      } else {
        const [rows, fields]: [Post[], FieldPacket[]] =
          await DAO.connection.query(
            `SELECT ` + `${columns} ` + `from ` + `${table} ` + `WHERE ${where}`
          );
        return rows;
      }
    } catch (e) {
      console.error(e);
    }
  }
  async update(table: String, set: String, where: String) {
    try {
      await DAO.connection.query(
        `UPDATE ` + `${table} ` + `SET ${set} ` + `WHERE ${where}`
      );
    } catch (e) {
      console.error(e);
    }
  }
  async delete(table: String, where: String) {
    try {
      await DAO.connection.query(
        `DELETE ` + `FROM ` + `${table} ` + `WHERE ${where}`
      );
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = new DAO();
