require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = 'mongodb+srv://yeswanth:yeswanth@nodeexpress.nfcbg.mongodb.net/noteApp?retryWrites=true&w=majority'

module.exports = { PORT, MONGODB_URI }