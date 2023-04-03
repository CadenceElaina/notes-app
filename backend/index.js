const express = require('express')
const app = express()
const cors = require('cors')


const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(express.static('build'))

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

const generateId = () => {
    const maxId = notes.length > 0
        //note ... spread is necessary for the .map to return indv numbers instead of [1, 2, 3]
        //so that the Math.max() can evaluate the indv numbers and actually work
        ? Math.max(...notes.map(n => n.id))
        : 0
    return maxId + 1
}

app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId(),
    }

    notes = notes.concat(note)

    response.json(note)
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    /*  const note = notes.find(note => {
         console.log(note.id, typeof note.id, id, typeof id, note.id === id)
         return note.id === id
     }) */

    if (note) {
        response.json(note)
    } else {
        //if the id of the note does not exist we return 404 not found
        response.status(404).end()
    }

    response.json(note)
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
})

/* app.post('/api/notes', (request, response) => {
    const note = request.body
    console.log(note)
    response.json(note)
})
 */

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

