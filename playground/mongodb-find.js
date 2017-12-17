const { MongoClient, ObjectID } = require('mongodb');
const stringify = (data) => JSON.stringify(data, undefined, 2);

MongoClient
  .connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
      console.log('Unable to connect to the MongoDB server.');
      return;
    }
    console.log('Connected to MongoDB server.');

    // db.collection('Todos').find({
    //   _id: new ObjectID('5a359f74fe5a9d7a86495df9')
    // }).toArray().then((todos) => {
    //   console.log(JSON.stringify(todos, undefined, 2));
    // }, (err) => {
    //   console.log('Unable to fetch todos', err)
    // });

    db.collection('Users')
      .find({ name: 'Konstantin' })
      // .count((err, count) => {
      //   console.log(count);
      // })
      .toArray()
      .then(docs => {
        console.log(stringify(docs));
      })

    db.close();
  });
