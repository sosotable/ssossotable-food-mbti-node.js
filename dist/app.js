"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// MARK: 환경변수 사용
require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const options = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "ssossotest",
};
const sessionStore = new MySQLStore(options);
const indexRouter = require("./routes/index");
const mainRouter = require("./routes/main");
const contentRouter = require("./routes/content");
const resultRouter = require("./routes/result");
const app = express();
// view engine setup
app.set("views", path.join(process.env.BUILD_PATH, "views"));
app.set("view engine", "ejs");
/**MARK: session 설정 부분
 * 항상 라우팅 앞에 두어야 기능함
 * **/
app.use(session({
    key: process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    // MARK: 세션 한 시간 유지
    cookie: { maxAge: 60 * 60 * 1000 },
}));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(process.env.BUILD_PATH, "public")));
// MARK: 라우팅
app.use("/", indexRouter);
app.use("/main", mainRouter);
app.use("/content", contentRouter);
app.use("/result", resultRouter);
// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});
// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render("error");
});
module.exports = app;
