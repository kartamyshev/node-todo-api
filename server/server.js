const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const pug = require('pug');

const { mongoose } = require('./db/mongoose');
const { Todo, User } = require('./models');

const app = express();
app.use(bodyParser.json());

app.set("view engine", "pug");

app.get('/', (request, response, next) => {
  const { headers } = request;
  response.render('home', {
    name: 'Konstantin',
    title: 'Home Page',
    headers: Object.keys(headers).map(header => {
      return {
        key: header,
        value: headers[header]
      }
    })
  });
});

app.get('/todos/json', (request, response) => {
  Todo.find()
    .then(todos => {
      response.send(todos);
    }, err => {
      response.status(400).send(error);
    });
});

app.get('/todos', (request, response, next) => {
  Todo.find().then(todos => {
    response.render('todos', {
      title: 'Todos Page',
      todos: todos
    });
  }, (error) => {
    response.render('home', {
      error: error
    });
  });
});

app.post('/todos', (request, response, next) => {
  const { text } = request.body;
  const todo = new Todo({ text });

  todo.save().then(doc => {
    response.send(doc);
  }, err => {
    response.status(400).send(err);
  })
});


// app.post('/users', (request, response, next) => {
//   const { email } = request.body;
//   const user = new User({ email });

//   user.save().then(doc => {
//     response.send(doc);
//   }, err => {
//     response.send(err);
//   });
// });



app.listen(process.env.PORT || 3000, () => {
  console.log('Server is listening on port 3000');
});

module.exports = { app };
