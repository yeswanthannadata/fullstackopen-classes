const mongoose = require("mongoose");

const url = `mongodb+srv://yeswanth:yeswanth@nodeexpress.nfcbg.mongodb.net/noteApp?retryWrites=true&w=majority`;
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minLength: 5,
  },
  date: {
    type: Date,
    required: true,
  },
  important: Boolean,
});

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Note", noteSchema);
