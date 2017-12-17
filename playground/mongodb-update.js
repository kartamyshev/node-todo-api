const { MongoClient, ObjectID } = require('mongodb');
const stringify = (data) => JSON.stringify(data, undefined, 2);

MongoClient
  .connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
      console.log('Unable to connect to the MongoDB server.');
      return;
    }
    console.log('Connected to MongoDB server.');

    const notCompleted = obj => {
      return Object.assign(obj, { completed: false })
    };

    // const todo = { text: 'Improve english skills' };
    // db.collection('Todos').insertOne(notCompleted(todo));

    // db.collection('Todos')
    //   .findOneAndUpdate(
    //     { _id: new ObjectID('5a365c62b15e9f8679b836f8') },
    //     {
    //       $set: {
    //         completed: true
    //       }
    //     },
    //     {
    //       returnOriginal: false
    //     }
    //   ).then(response => {
    //     console.log(stringify(response));
    //   });

      db.collection('Users').findOneAndUpdate(
        { _id: new ObjectID('5a35a0918931aa7a9b69779d') },
        {
          $set: {
            name: 'Konstantin'
          },
          $inc: {
            age: -1
          }
        },
        {
          returnOriginal: false
        }
      ).then(response => {
        console.log(stringify(response));
      });


    db.close();
  });
