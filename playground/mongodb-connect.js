const { MongoClient, ObjectID } = require('mongodb');

MongoClient
  .connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
      console.log('Unable to connect to the MongoDB server.');
      return;
    }
    console.log('Connected to MongoDB server.');

    db.collection('Todos').insertOne({
      text: 'Watch movie',
      completed: false
    }, (err, result) => {
      if (err) {
        console.log('Unable to insert todo', err);
        return;
      }
      console.log(JSON.stringify(result.ops, undefined, 2));
    });

    // db.collection('Users').insertOne({
    //   name: 'Konstantin',
    //   age: 32,
    //   location: 'Minsk, Belarus'
    // }, (err, result) => {
    //   if (err) {
    //     console.log('Unable to insert user', err);
    //     return;
    //   }
    //   console.log(
    //     result.ops[0]._id.getTimestamp()
    //   );
    // });

    db.close();
  });
