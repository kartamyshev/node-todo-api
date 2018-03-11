require('./config/config');

const express = require('express');
const { ObjectID } = require('mongodb');
const path = require('path');
const pug = require('pug');
const { pick } = require('lodash');

const { mongoose } = require('./db/mongoose');
const { Todo, User } = require('./models');
const initMiddleware = require('./initMiddleware');

const port = process.env.PORT;
const app = express();

app.set("view engine", "pug");
initMiddleware(app);

app.get('/', (request, response) => {
  response.send(request.headers);
});

app.get('/todos', (request, response) => {
  Todo.find().then(todos => {
    response.send(todos);
  });
});

app.get('/todos/:id', (request, response) => {
  const { id } = request.params;
  if (ObjectID.isValid(id) === false) {
    response.status(404).send('Inexistent Object ID.');
    return;
  }

  Todo.findById(id).then(todo => {
    if (!todo) {
      response.status(404).send('No id found in database');
    }
    response.status(200).send({ todo });
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

app.delete('/todos/:id', (request, response) => {
  const { id } = request.params;

  if (ObjectID.isValid(id) === false) {
    response.status(404).send('Inexistent Object ID.');
    return;
  }

  Todo.findByIdAndRemove(id).then(todo => {
    if (!todo) {
      response.status(404).send('No id found in database');
    }
    response.status(200).send({ todo });
  }).catch(error => {
    response.status(400).send();
  });

});

app.delete('/users/:id', (request, response) => {
  const { id } = request.params;

  if (ObjectID.isValid(id) === false) {
    response.status(404).send('Inexistent Object ID.');
  }

  User.findByIdAndRemove(id).then(user => {
    if (!user) {
      response.status(404).send('No id found in database');
    }
    response.status(200).send({ user });
  }).catch(error => {
    response.status(400).send();
  });
});

app.patch('/todos/:id', (request, response) => {
  const { id } = request.params;
  const { text, completed } = pick(request.body, ['text', 'completed']);

  if (ObjectID.isValid(id) === false) {
    return response.status(404).send('Inexistent Object ID.');
  }

  const updatedDoc = {
    text,
    completed,
    completedAt: completed ? Date.now() : null
  };

  Todo.findByIdAndUpdate(id,
    { $set: updatedDoc },
    { new: true }
  ).then(todo => {
    if (!todo) {
      return response.status(404).send();
    }
    response.status(200).send(todo);
  }, (err) => {
    response.status(400).send();
  });

});

app.patch('/users/:id', (request, response, next) => {
  const { id } = request.params;
  if (ObjectID.isValid(id) === false) {
    return response.status(404).send('Inexistent Object ID')
  }

  const updatedUser = {
    email: request.body.email
  }
  User.findByIdAndUpdate(id,
    { $set: updatedUser },
    { new: true }
  ).then(user => {
    if (!user) {
      return response.status(404).send('blah');
    }
    response.status(200).send(user);
  }, (err) => {
    response.status(400).send();
  });
});


app.get('/users', (request, response) => {
  User.find().then(users => {
    response.send(users);
  });
});

app.get('/users/:id', (request, response) => {
  const { id } = request.params;
  if (ObjectID.isValid(id) === false) {
    return response.status(404).send('Inexistent Object ID.');
  }

  User.findById(id).then(user => {
    if (!user) response.status(404).send();
    response.send({ user });
  }).catch(err => {
    response.status(400).send();
  });
});

app.post('/user/add', (request, response, next) => {
  const { email, password } = pick(request.body, ['email', 'password']);
  const user = new User({ email, password });

  user.save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then((token) => {
      response.header('x-auth', token).send(user);
    })
    .catch((err) => {
      response.status(400).send(err);
    });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

module.exports = { app };
