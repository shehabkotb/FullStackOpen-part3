const mongoose = require("mongoose")
const url = process.env.MONGODB_URI
mongoose.set("useFindAndModify", false)
mongoose.set("useCreateIndex", true)
const uniqueValidator = require("mongoose-unique-validator")

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("connected to mongodb")
  })
  .catch((error) => {
    console.log("error while connecting to mongodb", error)
  })

const personSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, unique: true },
  number: { type: String, required: true, minlength: 8 }
})

personSchema.plugin(uniqueValidator)

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model("person", personSchema)
