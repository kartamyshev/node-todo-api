const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {
  text: {
    type: String
  },
  completed: {
    type: Boolean,
  },
  completedAt: {
    type: Number
  }
});

var todo = new Todo({
  text: 'Write an article',
  completed: false,
  completedAt: Date.now()
});

const success = doc => console.log('Saved doc:', JSON.stringify(doc, undefined, 2));
const failure = err => console.log('Unable to save a doc', err);

todo.save().then(success, failure);
