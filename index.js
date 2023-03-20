// const http = require('http')
const express = require("express");
// const app = http.createServer((request, response) => {
//     response.writeHead(200, {'Content-Type': 'application/json'})
//     response.end(JSON.stringify(persons))
// })
const morgan = require("morgan");
const cors = require("cors");
const app = express();
// const app1 = http.createServer((req, res) => {
//   res.writeHead(200, { "Content-Type": "text/plain" });
//   res.end("Hello World");
// });
app.use(express.json());
app.use(cors());
//setup the logger
morgan.token("req-body", (req) => JSON.stringify(req.body));
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body"
  )
);
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Marry Poppendick",
    number: "39-23-6423122",
  },
];
//all
app.get("/", (req, res) => {
  res.send("<h1>Fullstack Open - Part3<h1>");
});
//get all persons
app.get("/api/persons", (req, res) => {
  res.json(persons);
});

//get info of person with id
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  console.log(person);
  if (person) {
    res.json(person);
  } else {
    // res.statusMessage = ""
    res.status(404).send("NOT FOUND");
  }
});
// delete person with id
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((p) => p.id !== id);

  res.status(204).end();
});
//show info
app.get("/info", (req, res) => {
  const date = new Date();
  res.send(`Phonebook has info for ${persons.length} people
    <br/> <br/>
    ${date}`);
});
const generatedId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
  console.log(maxId);
  return maxId + 1;
};
app.post("/api/persons", (req, res, next) => {
  const body = req.body;
  console.log(body);
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "The name of number is missing",
    });
  }
  const getNames = persons.map((p) => p.name);
  console.log(getNames);
  if (getNames.includes(body.name)) {
    return res.status(400).json({
      error: "Name must be unique",
    });
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generatedId(),
  };
  persons = persons.concat(person);
  console.log(person);
  res.json(person);
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
