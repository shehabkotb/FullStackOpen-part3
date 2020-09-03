require("dotenv").config()
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const app = express()
const Person = require("./models/person.js")

app.use(cors())
app.use(express.static("build"))
app.use(express.json())

morgan.token("post-data", function getPostData(request) {
  return JSON.stringify(request.body)
})

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :post-data"
  )
)

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>")
})

app.get("/info", (request, response, next) => {
  Person.countDocuments({})
    .then((result) => {
      response.send(
        `<p>phonebook has ${result} people</p>
      <p>${new Date()}</p>`
      )
    })
    .catch((error) => next(error))
})

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons)
    })
    .catch((error) => next(error))
})

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (!person) {
        return response.status(404).end()
      }
      response.json(person)
    })
    .catch((error) => next(error))
})

app.post("/api/persons/", (request, response, next) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing"
    })
  }

  // if (persons.find((person) => person.name === body.name)) {
  //   return response.status(409).json({
  //     error: "name already exists"
  //   })
  // }

  const newPerson = new Person({
    name: body.name,
    number: body.number
  })

  newPerson
    .save()
    .then((result) => {
      response.status(201).json(result)
    })
    .catch((error) => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
  const update = request.body
  if (!update.name || !update.number) {
    return response.status(400).json({
      error: "name or number missing"
    })
  }
  Person.findByIdAndUpdate(request.params.id, update, {
    new: true,
    runValidators: true,
    context: "query"
  })
    .then((result) => {
      if (!result) {
        return response.status(404).end()
      }
      response.json(result)
    })
    .catch((error) => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      if (!result) {
        return response.status(404).end()
      }
      response.status(204).end()
    })
    .catch((error) => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === "CastError" && error.kind == "ObjectId") {
    return response.status(400).send({ error: "malformatted id" })
  }
  if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
