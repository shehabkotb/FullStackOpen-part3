const mongoose = require("mongoose")

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  )
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.ipqy7.mongodb.net/phoneBook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model("Person", personSchema)

if (!(process.argv.length > 3)) {
  Person.find({}).then((result) => {
    result.forEach((contact) => {
      console.log(contact.name, contact.number)
    })
    mongoose.connection.close()
    process.exit(0)
  })
} else if (process.argv.length < 5) {
  console.log(
    "Please provide the contact to add: node mongo.js <password> <name> <number>"
  )
  process.exit(1)
} else {
  const name = process.argv[3]
  const number = process.argv[4]

  const newPerson = new Person({
    name: name,
    number: number
  })

  newPerson.save().then((result) => {
    console.log(`added ${name} ${number} to the phonebook`)
    mongoose.connection.close()
  })
}
