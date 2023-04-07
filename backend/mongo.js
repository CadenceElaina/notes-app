const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://cadenceelaina:${password}@cluster0.0mdoms4.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

//Mongoose Convention - Schemas refer to the name of the collection in the singular
const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

//Note model - models are constructor functions that create new JS objs based on the provided parameters
const note = new Note({
    content: 'Mongoose makes things easy',
    date: new Date(),
    important: true,
})

//The obj is saved to the DB with the save method
/* note.save().then(result => {
    console.log('note saved!')
    // connection must be closed for program to finish its execution
    mongoose.connection.close()
}) */
//Fetching objs from the DB
/*The objs are retrieved from the DB with the find method of the Note model. The parameter of the method
is an obj expressing search conditions. Since the parameter is an empty obj {}, we get all of the notes
stored in teh notes collection. https://mongoosejs.com/docs/api/model.html#Model.find()*/
Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})