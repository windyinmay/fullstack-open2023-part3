const http = require('http')
const express = require('express')
const { response } = require('express')
// const app = http.createServer((request, response) => {
//     response.writeHead(200, {'Content-Type': 'application/json'})
//     response.end(JSON.stringify(persons))
// })

const app = express()
let persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456'
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523'
    },
    {
        id: 3,
        name: 'Dan Abramov',
        number: '12-43-234345'
    },
    {
        id: 4,
        name: 'Marry Poppendick',
        number: '39-23-6423122'
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Fullstack Open - Part3<h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})


app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    console.log(person)
    if(person) {
        res.json(person)
    } else {
        // res.statusMessage = ""
        res.status(404).send('NOT FOUND')
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})

//show info
app.get('/info', (req,res) => {
    const date = new Date()
    res.send(`Phonebook has info for ${persons.length} people
    <br/> <br/>
    ${date}`)
})
const PORT = 3001
app.listen(PORT)
console.log(`Server is running on port ${PORT}`)