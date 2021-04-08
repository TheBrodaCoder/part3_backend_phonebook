const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
require('dotenv').config()
const Person = require('./models/personModel.js')


app.use(express.json())
app.use(express.static('build'))

morgan.token('content', (request) => {
  if (request.method === 'POST') {
    return `{ name: ${request.body.name}, number: ${request.body.number} }`
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms // :content[request]'))

app.use(cors())
  
app.get('/api', (request, response) => {
    response.send('<h1>Persons API</h1>');
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(
      phonebook => {
        if (phonebook) {
          response.json(phonebook)
        } else {
          response.status(404).json({error: 'error at requesting phonebook'})
        }
      }).catch(error => {
        response.status(500).end()
        console.log('error at finding People', error)
      })
    
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(per => {
    response.json(per)
  }).catch(
    error => {
      response.status(500).end()
      console.log('error at finding person with that id, sending 500')
  })
})

app.delete('/api/persons/:id', (request, response) => {
  
  Person.findByIdAndDelete(request.params.id).then(
    () => response.status(204).end()
  ).catch(
    error => {
      console.log('error at deleting person', error)
      response.status(500).end()
  })

  
})


app.post('/api/persons', (request, response) => {

  if (!request.body.name) {
    console.log('error at update on name')
    return response.status(400).json({
      error: "name is not defined"
    })
  } else if (!request.body.number) {
    console.log('error at update on number')
    return response.status(400).json({
      error: "number is not defined"
    })
  } else {
    Person.find({name: request.body.name}).then(
      existingName => {
        if (existingName.length > 0) {
          console.log('name already exist')
          response.status(400).json({error: 'name is already defined'})
        } else {
          const newPerson = new Person({
            name: request.body.name,
            number: request.body.number
          })
  
          newPerson.save().then( () =>{
            response.status(200).json({'status': 'Person saved'})
          }
          )
        }
      }
    ).catch(
      error => {
        console.log('error at finding person')
        response.status(500).json({"error": error})
      }
    )
  } 
})

app.put('/api/persons/:id', (request, response) => {
  const updatedPerson = ({
    name: request.body.name,
    number: request.body.number
  })

  Person.findByIdAndUpdate(request.params.id, updatedPerson, {new: true}).then(
    result => {
      if (result) {
        response.json(result)
      } else {
        response.status(404).json({"error": "There is no person with that id"})
      }
      
    }
  ).catch(
    error => console.log('error at updating')
  )
})

app.get('/info', (request, response) => {
  
  Person.find({}).then(
    result => {
      let date = new Date()
      response.send(
        `<div><h1>Info</h1><p><strong>Phonebook has info for ${result.length} persons</strong></p><h2>${date}</h2></div>`
      )
    }
  ).catch(
    err => console.log('error at info', err)
  )

  
})

const PORT =  process.env.PORT || 3001;
app.listen(PORT, () => {console.log(`Server running on port http://localhost:${PORT}/`)});