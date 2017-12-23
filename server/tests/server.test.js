const expect = require('expect');
const supertest = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo, User } = require('./../models');

const todos = [
  { _id: new ObjectID(), text: 'First test todo' },
  { _id: new ObjectID(), text: 'Second test todo' }
];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    const text = 'Test todo text 2';

    supertest(app)
      .post('/todo/add')
      .send({ text })
      .expect(200)
      .expect((response) => {
        expect(response.body.text).toBe(text);
      })
      .end((err, response) => {
        if (err) return done(err);
        Todo.find({ text }).then(todos => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch(err => {
          done(err);
        });
      });
  });

  it('should not create todo with invalid body data', done => {
    supertest(app)
      .post('/todo/add')
      .send({})
      .expect(400)
      .end((err, response) => {
        if (err) return done(err);
        Todo.find().then(todos => {
          expect(todos.length).toBe(2);
          done();
        }).catch(err => done(err));
      });
  });

});

describe('GET /todos', () => {
  it('should get all todos', done => {
    supertest(app)
      .get('/todos')
      .expect(200)
      .expect(response => {
        expect(response.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', done => {
    supertest(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect(response => {
        expect(response.body.todo.text).toBe(todos[0].text)
      })
      .end(done);
  });

  it('should return 404 if todo not found', done => {
    const hexId = new ObjectID().toHexString();
    supertest(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', done => {
    supertest(app)
      .get('/todos/123abc')
      .expect(404)
      .end(done);
  });

});
