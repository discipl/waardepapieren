var express = require('express')
var app = express()

app.get('/brp/basisregistratie/natuurlijke_personen/bsn/663678651', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify({
      "aanduiding_naamsgebruik": "V",
      "aanschrijving": {
        "adelijke_titel": "",
        "geslachtsnaam": "Vlasman",
        "voorletters": "S.",
        "voornamen": "Sanne",
        "voorvoegsel_geslachtsnaam": ""
      },
      "burgerservicenummer": "663678651",
      "emailadres": "SanneVlasman@gmail.com",
      "geboorte": {
        "datum": "05/07/1970",
        "land": "Nederland",
        "stad": "Utrecht"
      },
      "identificatie": "da02a3ac-4412-11e9-b210-d663bd873d93",
      "kinderen": [
        {
          "url": "/natuurlijke_personen/da02f050-4412-11e9-b210-d663bd873d93"
        },
        {
          "url": "/natuurlijke_personen/da02f1ae-4412-11e9-b210-d663bd873d93"
        }
      ],
      "naam": {
        "adelijke_titel": "",
        "geslachtsnaam": "Vlasman",
        "voorletters": "S.",
        "voornamen": "Sanne",
        "voorvoegsel_geslachtsnaam": ""
      },
      "ouders": [],
      "overlijden": {
        "datum": "",
        "land": "",
        "stad": ""
      },
      "partner": {},
      "postadres": {
        "huisnummer": 21,
        "postcode": "3512JC",
        "straatnaam": "Domplein",
        "woonplaats": "Utrecht"
      },
      "telefoonnummer": "(06)594-38-045",
      "url": "/natuurlijke_personen/da02a3ac-4412-11e9-b210-d663bd873d93",
      "verblijfadres": {
        "huisnummer": 21,
        "postcode": "3512JC",
        "straatnaam": "Domplein",
        "woonplaats": "Utrecht"
      }
    }
  ))
  res.end()
})

app.listen(80)
