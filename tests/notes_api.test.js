const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Note = require('../models/note')
const helper = require('./test_helper')

beforeEach(async () => {
  await Note.deleteMany({})
  let noteObj = new Note(helper.initialNotes[0])
  await noteObj.save()
  noteObj = new Note(helper.initialNotes[1])
  await noteObj.save()
}, 100000)

test('notes are returned as json', async () => {
  await api.get('/api/notes').expect(200).expect('Content-Type', /application\/json/)
}, 100000)

test('there are two notes', async () => {
  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(helper.initialNotes.length)
}, 100000)

test('first note is about html content', async() => {
  const response = await api.get('/api/notes')

  expect(response.body[0].content).toBe(helper.initialNotes[0].content)
}, 100000)

test('a specific note is within the notes', async() => {
  const response = await api.get('/api/notes')

  const notes = response.body.map(each => each.content)
  expect(notes).toContain('Browser can execute only Javascript')
}, 100000)

test('a valid note can be added', async () => {
  const newNote = {
    content: 'async/await simplifies making api calls',
    important: true
  }

  await api.post('/api/notes').send(newNote).expect(201).expect('Content-Type', /application\/json/)

  const response = await helper.notesInDb()
  expect(response).toHaveLength(helper.initialNotes.length+1)

  const contents = response.map(each => each.content)
  expect(contents).toContain('async/await simplifies making api calls')
}, 100000)

test('a note without content is not added', async () => {
  const newNote = {
    important: true
  }

  await api.post('/api/notes').send(newNote).expect(400)

  const response = await helper.notesInDb()
  expect(response).toHaveLength(helper.initialNotes.length)
}, 100000)

test('a specific note can be viewed', async () => {
  const notesAtStart = await helper.notesInDb()
  const noteToView = notesAtStart[0]

  const resultNote =  await api.get(`/api/notes/${noteToView.id}`)
    .expect(200).expect('Content-Type', /application\/json/)

  const processedNoteToView = JSON.parse(JSON.stringify(noteToView))
  expect(resultNote.body).toEqual(processedNoteToView)
}, 100000)

test('a note can be deleted', async () => {
  const notesAtStart = await helper.notesInDb()
  const noteToDelete = notesAtStart[0]

  await api.delete(`/api/notes/${noteToDelete.id}`).expect(204)

  const notesAtEnd = await helper.notesInDb()
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length-1)

  const contents = notesAtEnd.map(each => each.content)
  expect(contents).not.toContain(noteToDelete.content)
}, 100000)

afterAll(() => {
  mongoose.connection.close()
})