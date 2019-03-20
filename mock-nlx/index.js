var express = require('express')
var app = express()

app.get('/brp/basisregistratie/natuurlijke_personen/bsn/663678651', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify({
      'voornamen': 'Frans',
      'geslachtsnaam': 'Hals',
      'straatnaam': 'Groot Heiligland',
      'huisnummer': '4',
      'postcode': '2011 ES',
      'woonplaats': 'Utrecht'
    }
  ))
  res.end()
})

app.listen(4080)
