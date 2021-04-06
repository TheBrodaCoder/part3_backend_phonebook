const e = require('express')
const { request, response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
    
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
    
  },
  {
    "id": 3,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  },
  {
    "id": 4,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  }
];

app.use(express.json())

morgan.token('content', (request) => {
  if (request.method === 'POST') {
    return `{ name: ${request.body.name}, number: ${request.body.number} }`
  } else if (request.method == 'GET') {
    return `{ number of persons requested: ${persons.length}}`
  } else if (request.method == 'DELETE') {
    return `{ attempted to delete person with id: ${request.params.id} }`
  }
  
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms // :content[request]'))

app.use(cors())
  
app.get('/api', (request, response) => {
    response.send('<h1>Persons API</h1>');
})

app.get('/api/persons', (request, response) => {
    console.log('requesting persons')
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    console.log(`requesting ${person}`)
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log(`Deleting ${id} person`);

  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const nameExist = (name) => {
  return persons.find(person => person.name === name)
}

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
    
    if (nameExist(request.body.name)) {
      console.log('error at update, name exists')
      return response.status(400).json({
        error: `${request.body.name} already exists`
      })
    } else {
      const person = {
        id: request.params.id,
        name: request.body.name,
        number: request.body.number
      }
      persons = persons.concat(person)
      return response.status(200).json(persons)
    }
  } 
  
})

app.get('/info', (request, response) => {
  let entries = persons.length;
  let date = new Date();

  response.send(
    `<div><h1>Info</h1><p><strong>Phonebook has info for ${entries} persons</strong></p><h2>${date}</h2></div>`
  )
})

const PORT =  process.env.PORT || 3001;
app.listen(PORT, () => {console.log(`Server running on port http://localhost:${PORT}/`)});