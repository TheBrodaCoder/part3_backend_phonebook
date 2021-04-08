const mongoose = require('mongoose')
require('dotenv').config()
const url = process.env.BASE_URL
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }).then(
  result => {
    console.log('Connected to database')
  }).catch(error => {
    console.log('Error at connecting server', error)
  })

const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: Number
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
    
module.exports = mongoose.model('Person', personSchema);

