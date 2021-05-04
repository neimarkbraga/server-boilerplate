const { connect, SchemaTypes } = require('mongoose');
const express = require('express');
const models = require('../models');
const Utils = require('../libs/Utils');
const ServerError = require('../libs/ServerError');

class Database {
  static models = models;

  static ensureModelSchema(Model, value) {
    const castType = (type, value) => {
      if (Array.isArray(type) && Array.isArray(value))
        return value.map(subValue => castType(type[0], subValue));

      if (type === SchemaTypes.Date)
        return new Date(value);

      return value;
    };

    for (let key of Object.keys(Model.schema.obj)) {
      if (value[key] !== undefined) {
        value[key] = castType(Model.schema.obj[key].type, value[key]);
      }
    }

    return value;
  }

  static expressCRUD(Model) {
    const app = express.Router();
    const kebabName = Utils.pascalToKebab(Model.modelName);

    app.post(`/${kebabName}`, async (req, res, next) => {
      try {
        const item = new Model(req.body);
        await item.save();
        await res.json(item);
      }
      catch (e) {
        next(e);
      }
    });

    app.get(`/${kebabName}`, async (req, res, next) => {
      try {
        await res.json(await Model.find(req.query));
      }
      catch (e) {
        next(e);
      }
    });

    app.get(`/${kebabName}/:id`, async (req, res, next) => {
      try {
        const item = await Model.findOne({...req.query, _id: req.params.id});
        item ? await res.json(item) : next();
      }
      catch (e) {
        next(e);
      }
    });

    app.put(`/${kebabName}/:id`, async (req, res, next) => {
      try {
        const item = await Model.findOne({...req.query, _id: req.params.id});
        if (item) {
          for (let key of Object.keys(req.body))
            item[key] = req.body[key];
          await item.save();
          await res.json(item);
        }
        else {
          next();
        }
      }
      catch (e) {
        next(e);
      }
    });

    app.delete(`/${kebabName}/:id`, async (req, res, next) => {
      try {
        const item = await Model.findOne({...req.query, _id: req.params.id});
        item ? await item.remove() : ServerError.throw(400, 'ID does not exist.');
        await res.json({message: 'Delete successful.'});
      }
      catch (e) {
        next(e);
      }
    });

    return app;
  }

  static connect() {
    return connect(process.env.APP_DATABASE_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
  }
}

module.exports = Database;