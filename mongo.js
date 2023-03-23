const mongoose = require("mongoose");
const password = process.argv[2];

const url = `mongodb+srv://windyinmay:${password}@windyinmay.lymjfsp.mongodb.net/phonebook-part3?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const phonebookSchema = new mongoose.Schema({
  //   id: Number,
  name: String,
  number: String,
});

const PhoneBook = mongoose.model("PhoneBook", phonebookSchema);

PhoneBook.name = process.argv[3];
PhoneBook.number = process.argv[4];

const phonebook = new PhoneBook({
  //   id: Math.floor(Math.random() * 10000000),
  name: process.argv[3],
  number: process.argv[4],
});

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

if (process.argv.length == 3) {
  PhoneBook.find({}).then((result) => {
    console.log(`Phonebook:`);
    result.forEach((phonebook) => {
      console.log(`${phonebook.name} ${phonebook.number}`);
      mongoose.connection.close();
    });
  });
}

if (process.argv.length > 3) {
  phonebook.save().then((result) => {
    console.log(
      `added ${phonebook.name} number ${phonebook.number} to phonebook`
    );
    mongoose.connection.close();
  });
}
