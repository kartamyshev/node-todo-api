require('./config/config');

const express = require('express');
const { ObjectID } = require('mongodb');
const path = require('path');
const pug = require('pug');
const { pick } = require('lodash');

const { mongoose } = require('./db/mongoose');
const { Todo, User } = require('./models');
const { initMiddleware } = require('./middleware/init');
const { authenticate } = require('./middleware/authenticate');

const port = process.env.PORT;
const app = express();

app.set("view engine", "pug");
initMiddleware(app);

app.get('/', (request, response) => {
  response.send(request.headers);
});

app.get('/todos', authenticate, (request, response) => {
  Todo
    .find({ _creator: request.user._id })
    .then(todos => {
      response.send(todos);
    });
});

app.get('/todo/:id', authenticate, (request, response) => {
  const { id } = request.params;
  if (ObjectID.isValid(id) === false) {
    response.status(404).send('Inexistent Object ID.');
    return;
  }

  Todo.findOne({
    _id: id,
    _creator: request.user._id
  }).then(todo => {
    if (!todo) {
      response.status(404).send('No id found in database');
    }
    response.status(200).send({ todo });
  }).catch(err => {
    response.status(400).send();
  });
});

app.delete('/todo/:id', authenticate, (request, response, next) => {
  const { id } = request.params;

  if (ObjectID.isValid(id) === false) {
    response.status(404).send('Inexistent Object ID.');
    return;
  }

  Todo.findOneAndRemove({
    _id: id,
    _creator: request.user._id
  }).then(todo => {
    if (todo === null) {
      response.status(404).send('No id found in database');
    }
    response.status(200).send({ todo });
  }).catch(error => {
    response.status(400).send();
  });

  next();

});

app.post('/todo/add', authenticate, (request, response, next) => {
  const { text, completed } = request.body;
  const _creator = request.user._id;
  const todo = new Todo({ text, completed, _creator });

  todo.save().then(doc => {
    response.send(doc);
  }, err => {
    response.status(400).send(err);
  })
});

app.patch('/todo/:id', authenticate, (request, response) => {
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

  Todo.findOneAndUpdate({
    _id: id,
    _creator: request.user._id
  },
    { $set: updatedDoc },
    { new: true }
  ).then(todo => {
    if (!todo) {
      return response.status(404).send('No id found in database');
    }
    response.status(200).send(todo);
  }, (err) => {
    response.status(400).send();
  });

});

app.delete('/user/:id', (request, response) => {
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

app.patch('/user/:id', (request, response, next) => {
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
      return response.status(404).send('No id found in database');
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

app.get('/user/:id', (request, response) => {
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

app.post('/users/login', (request, response, next) => {
  const body = pick(request.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password)
    .then((user) => {
      return user.generateAuthToken().then((token) => {
        response.header('x-auth', token).send(user);
      });
    })
    .catch((err) => {
      response.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (request, response, next) => {
  request.user.removeToken(request.token).then(() => {
    response.status(200).send();
  }, () => {
    response.status(400).send();
  });
});

app.get('/users/me', authenticate, (request, response, next) => {
  response.status(200).send(request.user);
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

module.exports = { app };
