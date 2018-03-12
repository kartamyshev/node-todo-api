const mongoose = require('mongoose');
const validator = require('validator');
const { sign, verify } = require('jsonwebtoken');
const { pick } = require('lodash');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 15,
    unique: true,
    validate: {
      validator: (value) => {
        return validator.isEmail(value);
      },
      // validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.toJSON = function() {
  const user = this;
  return pick(user.toObject(), ['email', '_id']);
};

UserSchema.methods.generateAuthToken = function() {
  const user = this;
  const access = 'auth';
  const token = sign({
    _id: user._id.toHexString(),
    access: access
  }, 'abc123').toString();

  user.tokens = user.tokens.concat([{ access, token }])

  return user.save().then(() => {
    return token;
  });
};

UserSchema.statics.findByToken = function(token) {
  const User = this;
  let decoded;

  try {
    decoded = verify(token, 'abc123');
  } catch (error) {
    return Promise.reject('Invalid x-auth token');
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
}

const User = mongoose.model('User', UserSchema);

module.exports = { User };
