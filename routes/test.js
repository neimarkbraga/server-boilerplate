const express = require('express');
const { models } = require('../libs/Database');
const app = express.Router();

app.post('/', async (req, res, next) => {
  try {
    const message = new models.TestMessage(req.body);
    await res.json(await message.save());
  }
  catch (e) {
    next(e);
  }
});

app.get('/', async (req, res, next) => {
  try {
    const messages = await models.TestMessage.find();
    await res.json(messages);
  }
  catch (e) {
    next(e);
  }
});

app.put('/:id', async (req, res, next) => {
  try {
    const message = await models.TestMessage.findById(req.params.id);
    for (let key of Object.keys(req.body))
      message[key] = req.body[key];
    await res.json(await message.save());
  }
  catch (e) {
    next(e);
  }
});

app.delete('/:id', async (req, res, next) => {
  try {
    const message = await models.TestMessage.findById(req.params.id);
    await message.remove();
    await res.json({message: 'Deleted successfully.'});
  }
  catch (e) {
    next(e);
  }
});

module.exports = app;
