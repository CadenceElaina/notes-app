const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Note = require('../models/note')

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true,
  },
]

beforeEach(async () => {
  await Note.deleteMany({})
  let noteObject = new Note(initialNotes[0])
  await noteObject.save()
  noteObject = new Note(initialNotes[1])
  await noteObject.save()
}, 100000)
//note my internet is trash so the ,100000 appears to be necessary for each to prevent timeout
//insane I live within 20 miles of a major city in the US and I have access to only one internet provider and it offers speeds up to 10mbs at best and is incredibly unreliable... sigh
//temporary of course... I will get a new place soon 
test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/) //regex / / \ escapes the / so not to end the regex expression
  //alternatively the test could also be defined as a string... .expect('Content-Type', 'application/json')
  /*The problem here, however, is that when using a string, the value of the header must be exactly the same. 
  For the regex we defined, it is acceptable that the header contains the string in question. */
}, 100000)

test('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(initialNotes.length)
}, 100000)

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content)
  expect(contents).toContain(
    'Browser can execute only JavaScript'
  )
}, 100000)

afterAll(async () => {
  await mongoose.connection.close()
})