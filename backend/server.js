const express = require('express')
const dbConnect = require('./database/index')
const {PORT} = require('./config/index')
const app = express()
dbConnect();

app.get('/', (req, res) => {
  res.json({msg:'Hello World!! em here'})
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})