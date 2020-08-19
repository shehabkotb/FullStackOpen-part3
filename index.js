const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const app = express()

app.use(cors())
app.use(express.static("build"))
app.use(express.json())

morgan.token("post-data", function getPostData(request) {
  // debugger
  return JSON.stringify(request.body)
})

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :post-data"
  )
)

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }
]

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>")
})

app.get("/info", (request, response) => {
  response.send(
    `<p>phonebook has ${persons.length} people</p>
  <p>${new Date()}</p>`
  )
})

app.get("/api/persons", (request, response) => {
  response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
  let toDisplay = persons.find(
    (person) => person.id === Number(request.params.id)
  )
  if (!toDisplay) {
    return response.status(404).end()
  }
  response.json(toDisplay)
})

app.post("/api/persons/", (request, response) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing"
    })
  }

  if (persons.find((person) => person.name === body.name)) {
    return response.status(409).json({
      error: "name already exists"
    })
  }

  let maxID = 99999999
  const newPerson = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * Math.floor(maxID))
  }
  persons = persons.concat(newPerson)
  response.status(201).json(newPerson)
})

app.delete("/api/persons/:id", (request, response) => {
  let toDelete = persons.find(
    (person) => person.id === Number(request.params.id)
  )
  if (!toDelete) {
    return response.status(404).end()
  }
  persons = persons.filter((person) => person.id !== toDelete.id)
  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
