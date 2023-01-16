module.exports = {
    db_info: class {
        constructor(database) {
            this.host = process.env.DB_HOST
            this.port = process.env.DB_PORT
            this.user = process.env.DB_USER
            this.password = process.env.DB_PASSWORD
            this.database = database
        }
    }
}