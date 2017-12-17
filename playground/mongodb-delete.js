const { MongoClient, ObjectID } = require('mongodb');
const stringify = (data) => JSON.stringify(data, undefined, 2);

MongoClient
  .connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
      console.log('Unable to connect to the MongoDB server.');
      return;
    }
    console.log('Connected to MongoDB server.');

    // deleteMany
    // db.collection('Todos').deleteMany({ text: 'Eat lunch' }).then(result => {
    //   console.log(result);
    // });


    // deleteOne
    // db.collection('Todos').deleteOne({ text: 'Walk the dog' }).then((result) => {
    //   console.log('Result:', result);
    // }, (err) => {
    //   console.log('Error:', err);
    // });


    // findOneAndDelete
    // db.collection('Todos').findOneAndDelete({ completed: false }).then(deletedOne => {
    //   console.log(stringify(deletedOne.value, undefined, 2));
    // });

    // db.collection('Users')
    //   .deleteMany({ name: 'Konstantin' })
    //   .then(res => {
    //     console.log(res)
    //   }, err => {
    //     console.log(err)
    //   });

    db.collection('Users')
      .findOneAndDelete({ _id: new ObjectID('5a361a04c2ac2e7b34176d38') })
      .then(deletedOne => {
        console.log(stringify(deletedOne));
      })


    // db.close();
  });
