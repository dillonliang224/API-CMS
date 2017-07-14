/*
*  api-cms
* */
const path = require('path');
const Server = require('./lib/server');
const Logger = require('./lib/logger');
const error = require('./lib/error');


const config = global.config = require('./config');
const logger = global.logger = new Logger(config.log);

const server = new Server({
    host: config.server.host,
    key: config.server.key,
    cert: config.server.cert,
    port: {
        http: config.server.port.http,
        https: config.server.port.https
    }
});

server.config(function(app){
    app.set('x-powered-by', false);
    app.set('trust proxy', true);
});


//======================================
const body = require('body-parser');
const cookie = require('cookie-parser');
const timeout = require('connect-timeout');
const compression = require('compression');
const favicon = require('serve-favicon');

server.middleware(function(app){
    app.use(compression());
    app.use(timeout('20s'));
    app.use(cookie());
    app.use(body.json());
    app.use(body.urlencoded({
        extended: true
    }));
    app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));
});

server.middleware(function (app) {
    app.use(server.static('./static'));
});

//=======================================
const apilog = require('./middleware/log/api');
const pagging = require('./middleware/paging/index');
const session = require('./middleware/session/index');

server.middleware(function (app) {
    app.use(apilog());
    app.use(session());
    app.use(pagging());
});


//路由设置=======================================
const router = require('./router/index');

server.route(function(app){
    router(app);
});

//=======================================
const errorHandler = require('./middleware/error/index');

server.error(function(app){
    app.use(errorHandler.notFoundHandler());
    app.use(errorHandler.serverErrorHandler());
});

module.exports = server;