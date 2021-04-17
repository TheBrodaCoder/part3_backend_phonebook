const mongoose = require('mongoose')
require('dotenv').config()
const url = process.env.BASE_URL
const uniqueValidator = require('mongoose-unique-validator')
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }).then(
  result => {
    console.log('Connected to database')
  }).catch(error => {
    console.log('Error at connecting server', error)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
    unique: true
  },
  number: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: (strtotest) => {
      return /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(strtotest)
      }
    }
    
  }
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
    
module.exports = mongoose.model('Person', personSchema);

