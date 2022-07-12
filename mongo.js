const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as the argument: node mongo.js <password> "
  );
  process.exit(1);
}

const password = process.argv[2];

const url = process.env.MONGODB_URI;

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

mongoose.connect(url).then((result) => {
  console.log("connected");

  // const note = new Note({
  //   content: "NodeJs is necessary",
  //   date: new Date(),
  //   important: false,
  // });

  // return note.save();
  Note.find({}).then((notes) => {
    notes.forEach((note) => console.log(note));
    mongoose.connection.close();
  });
});
