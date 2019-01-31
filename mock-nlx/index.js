var express = require('express')
var app = express()

app.get('/haarlem/Basisregistratiepersonen/RaadpleegIngeschrevenPersoonNAW', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify({
    'woonplaats': 'Haarlem'
  }))
  res.end()
})

app.listen(4080)
