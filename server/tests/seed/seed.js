const expect = require('expect');
const supertest = require('supertest');
const { ObjectID } = require('mongodb');
const { Todo, User } = require('../../models');

const users = [
  {
    _id: new ObjectID(),
    email: 'andrew@example.com',
    password: 'userOnePass',
    tokens: []
  },
  {}
];

const todos = [
  {
    _id: new ObjectID(),
    text: 'First test todo'
  },
  {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
  }
];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos)
  }).then(()  => done());
};

module.exports = { todos, populateTodos };
