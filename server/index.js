require('dotenv').config()
const express = require('express')
const cors = require('cors')
const itemRouter = require('./routes/routes')

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(cors())
app.use('/api', itemRouter)

app.get('/', (_, res) => {
    res.send('Это работает')
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}...`))