const mongoose = require('mongoose')
const { Schema, model } = mongoose

const userSchema = new Schema({
  __v: { type: Number, select: false },
  name: { type: String, require: true },
  password: { type: String, required: true, select: true },
  avatar_url: { type: String},
  gender: { type: String, enum: ['male', 'female'], default: 'male', select: false},
  headline: {type: String, select: false},
  locations: { type: [{type: String}], select: false}
})

module.exports =  model('User', userSchema)
