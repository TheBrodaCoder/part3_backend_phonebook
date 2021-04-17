const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
} else if (process.argv.length === 3) {
    const password = process.argv[2]
    const url = `mongodb+srv://fullstack:${password}@phonebookdb.4ejvi.mongodb.net/phonebookDB?retryWrites=true&w=majority`
    
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

    const personSchema = new mongoose.Schema({
        id: Number,
        name: String,
        number: Number
    })
    
    const Person = mongoose.model('Person', personSchema)
    
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
      })

} else {
    const password = process.argv[2]
    const newName = process.argv[3]
    const newNumber = process.argv[4]
    
    
    const url =
      `mongodb+srv://fullstack:${password}@phonebookdb.4ejvi.mongodb.net/phonebookDB?retryWrites=true&w=majority`
    
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    
    const personSchema = new mongoose.Schema({
        id: Number,
        name: String,
        number: Number
    })
    
    const Person = mongoose.model('Person', personSchema)
    
    const person = new Person({
        name: newName,
        number: newNumber
    })
    
    person.save().then(result => {
      console.log('person saved!')
      mongoose.connection.close()
    })
}

