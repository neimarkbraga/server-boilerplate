const express = require('express');
const ServerError = require('../libs/ServerError');
const app = express.Router();

app.use('/test', require('./test'));

app.use(ServerError.express404Handler);

app.use(ServerError.express500Handler);

module.exports = app;
