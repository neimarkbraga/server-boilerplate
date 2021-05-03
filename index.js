require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const Database = require('./libs/Database');
const routes = require('./routes');
const app = express();

(async () => {
  try {
    // connect to database
    await Database.connect();

    // enable cross origin
    app.use(cors());

    // parse body
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    // routes
    app.use(routes);

    // start server
    const server = app.listen(Number(process.env.APP_PORT || 86), () => {
      console.log(`Server started at port ${server.address().port}`);
    });
  }
  catch (e) {
    console.error(e);
    process.exit();
  }
})();
