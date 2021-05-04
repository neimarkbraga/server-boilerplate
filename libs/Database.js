const { connect, SchemaTypes } = require('mongoose');
const express = require('express');
const models = require('../models');
const Utils = require('../libs/Utils');
const ServerError = require('../libs/ServerError');

class Database {
  static models = models;

  static populateQueryRefs(query) {
    const { obj: schema } = query.model.schema;
    return query.populate(Object.keys(schema).filter(key => {
      if (Array.isArray(schema[key]))
        return !!schema[key][0].ref;
      return !!schema[key].ref;
    }));
  }

  static expressCRUD(Model) {
    const app = express.Router();
    const kebabName = Utils.pascalToKebab(Model.modelName);

    app.post(`/${kebabName}`, async (req, res, next) => {
      try {
        const item = new Model(req.body);
        await item.save();

        const query = Model.findById(item._id);
        Database.populateQueryRefs(query);

        await res.json(await query.exec());
      }
      catch (e) {
        next(e);
      }
    });

    app.get(`/${kebabName}`, async (req, res, next) => {
      try {
        const query = Model.find(req.query);
        Database.populateQueryRefs(query);
        await res.json(await query.exec());
      }
      catch (e) {
        next(e);
      }
    });

    app.get(`/${kebabName}/:id`, async (req, res, next) => {
      try {
        const query = Model.findOne({...req.query, _id: req.params.id});
        Database.populateQueryRefs(query);
        const item = await query.exec();

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

          const query = Model.findById(item._id);
          Database.populateQueryRefs(query);

          await res.json(await query.exec());
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