const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Note = require('../models/note')

const initialNotes = [
  {
    content: 'HTML is easy',
    date: new Date(),
    important: false,
  },
  {
    content: 'Browser can execute only Javascript',
    date: new Date(),
    important: true,
  },
]

beforeEach(async () => {
  await Note.deleteMany({})
  let noteObj = new Note(initialNotes[0])
  await noteObj.save()
  noteObj = new Note(initialNotes[1])
  await noteObj.save()
})

test('notes are returned as json', async () => {
  await api.get('/api/notes').expect(200).expect('Content-Type', /application\/json/)
}, 100000)

test('there are two notes', async () => {
  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(initialNotes.length)
}, 100000)

test('first note is about html content', async() => {
  const response = await api.get('/api/notes')

  expect(response.body[0].content).toBe(initialNotes[0].content)
}, 100000)

test('a specific note is within the notes', async() => {
  const response = await api.get('/api/notes')

  const notes = response.body.map(each => each.content)
  expect(notes).toContain('Browser can execute only Javascript')
}, 100000)

afterAll(() => {
  mongoose.connection.close()
})