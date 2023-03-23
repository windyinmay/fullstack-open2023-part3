// const http = require('http')
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const PhoneBook = require("./models/person");

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(express.static("build"));

const morgan = require("morgan");
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

//fetch all
app.get("/", (req, res) => {
  res.send("<h1>Fullstack Open - Part3<h1>");
  // res.json(persons);
});

//get all persons
app.get("/api/persons", (req, res) => {
  PhoneBook.find({}).then((persons) => {
    res.json(persons);
  });
});

//get info of person with id
app.get("/api/persons/:id", (req, res, next) => {
  // const id = Number(req.params.id);
  // const person = persons.find((person) => person.id === id);
  // console.log(person);
  PhoneBook.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        // res.statusMessage = ""
        // res.status(404).send("NOT FOUND");
        res.status(404).end();
      }
    })
    // .catch((error) => {
    //   console.log(error);
    //   res.status(400).send({ error: "malformatted id" });
    // });
    // moving the error handling into middleware with next
    .catch((error) => next(error));
});

// delete person with id
app.delete("/api/persons/:id", (req, res, next) => {
  // const id = Number(req.params.id);
  // persons = persons.filter((p) => p.id !== id);
  PhoneBook.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});
//show info
app.get("/info", (req, res, next) => {
  const date = new Date();
  // res.send(`Phonebook has info for ${persons.length} people
  //   <br/> <br/>
  //   ${date}`);
  PhoneBook.find({})
    .then((persons) => {
      res.send(`Phonebook has info for ${persons.length} people
    <br/> <br/>
    ${date}`);
    })
    .catch((error) => next(error));
});
const generatedId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
  console.log(maxId);
  return maxId + 1;
};

// app.use(requestLogger);

app.post("/api/persons", (req, res, next) => {
  const body = req.body;
  // console.log(body);
  // if (!body.name || !body.number) {
  //   return res.status(400).json({
  //     error: "The name or number is missing",
  //   });
  // }
  // const getNames = persons.map((p) => p.name);
  // console.log(getNames);
  // if (getNames.includes(body.name)) {
  //   return res.status(400).json({
  //     error: "Name must be unique",
  //   });
  // }
  // const person = {
  //   name: body.name,
  //   number: body.number,
  //   id: generatedId(),
  // };
  // persons = persons.concat(person);
  // console.log(person);
  // res.json(person);
  const personObj = new PhoneBook({
    name: body.name,
    number: body.number,
  });

  PhoneBook.find({ name: body.name })
    .then((person) => {
      if (person.length > 0) {
        res.status(400).json({
          error: `Name must be unique. Contact ${body.name} is already in the phonebook. Want to update?`,
        });
      } else {
        personObj
          .save()
          .then((savedPerson) => {
            res.json(savedPerson);
          })
          .catch((error) => next(error));
      }
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  PhoneBook.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

// handler of requests with unknown endpoint
app.use(unknownEndpoint);
// handler of requests with result to errors
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
