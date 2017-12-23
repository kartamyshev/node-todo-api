const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const pug = require('pug');
const { ObjectID } = require('mongodb');
const port = process.env.PORT || 3000;

const { mongoose } = require('./db/mongoose');
const { Todo, User } = require('./models');

const app = express();
app.use(bodyParser.json());

app.set("view engine", "pug");

app.get('/', (request, response) => {
  const { headers } = request;
  response.send(headers);
});

app.get('/todos', (request, response) => {
  Todo.find().then(todos => {
    response.send({ todos });
  });
});

app.get('/todos/:id', (request, response) => {
  const { id } = request.params;
  if (ObjectID.isValid(id) === false) {
    response.status(404).send();
    return;
  }

  Todo.findById(id).then(todo => {
    if (!todo) response.status(404).send();
    response.send({ todo });
  }).catch(err => {
    response.status(400).send();
  });
});

app.get('/users', (request, response) => {
  User.find().then(users => {
    response.send({ users });
  });
});

app.get('/users/:id', (request, response) => {
  const { id } = request.params;
  if (ObjectID.isValid(id) === false) {
    response.status(404).send();
    return;
  }

  User.findById(id).then(user => {
    if (!user) response.status(404).send();
    response.send({ user });
  }).catch(err => {
    response.status(400).send();
  });
});

app.post('/todo/add', (request, response, next) => {
  const { text, completed } = request.body;
  const todo = new Todo({ text, completed });

  todo.save().then(doc => {
    response.send(doc);
  }, err => {
    response.status(400).send(err);
  })
});

app.post('/user/add', (request, response, next) => {
  const { email } = request.body;
  const user = new User({ email });

  user.save().then(doc => {
    response.send(doc);
  }, err => {
    response.send(err);
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

module.exports = { app };
