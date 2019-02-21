var express = require('express')
var app = express()

app.get('/haarlem/Basisregistratiepersonen/RaadpleegIngeschrevenPersoonNAW', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify({
      'voornamen': 'Frans',
      'geslachtsnaam': 'Hals',
      'straatnaam': 'Groot Heiligland',
      'huisnummer': '4',
      'postcode': '2011 ES',
      'woonplaats': 'Haarlem'
    }
  ))
  res.end()
})

app.listen(4080)
