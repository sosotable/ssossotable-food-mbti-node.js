module.exports = {
  db_info: class {
    private host: undefined | String;
    private port: undefined | String;
    private user: undefined | String;
    private password: undefined | String;
    private database: undefined | String;
    constructor(database: String) {
      this.host = process.env.DB_HOST;
      this.port = process.env.DB_PORT;
      this.user = process.env.DB_USER;
      this.password = process.env.DB_PASSWORD;
      this.database = database;
    }
  },
};
