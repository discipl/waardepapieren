var express = require('express')
var app = express()
var fs = require('fs')
let gemeentenLijst = JSON.parse(fs.readFileSync('data-gemeenten-alfabetisch.json', 'utf-8'))

app.get('/cbs/gemeentenlijst/gemeentecode/0392', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify(
    gemeentenLijst)
  )
  res.end()
})

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
        "stad": "Haarlem"
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
        "straatnaam": "Stationsplein",
        "woonplaats": "Haarlem"
      },
      "telefoonnummer": "(06)594-38-045",
      "url": "/natuurlijke_personen/da02a3ac-4412-11e9-b210-d663bd873d93",
      "verblijfadres": {
        "huisnummer": 21,
        "postcode": "3512JC",
        "straatnaam": "Stationsplein",
        "woonplaats": "Haarlem"
      }
    }
  ))
  res.end()
})

app.get('/brp/basisregistratie/verblijfplaatshistorie/bsn/663678651', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify( {
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
      "stad": "Hoorn"
    },
    "functieAdres": "woonadres",
    "huisletter": "B",
    "huisnummer": 23,
    "huisnummertoevoeging": "IV",
    "aanduidingBijHuisnummer": "tegenover",
    "identificatiecodeNummeraanduiding": "0518200000366054",
    "naamOpenbareRuimte": "Loosduinsekade",
    "postcode": "2571CC",
    "woonplaatsnaam": "Hoorn",
    "identificatiecodeAdresseerbaarObject": "0518200000366054",
    "indicatieVestigingVanuitBuitenland": true,
    "locatiebeschrijving": "Naast de derde brug",
    "straatnaam": "string",
    "vanuitVertrokkenOnbekendWaarheen": "false",
    "datumAanvangAdreshouding": {
      "dag": 3,
      "datum": "1989-05-03",
      "jaar": 1989,
      "maand": 5
    },
    "datumIngangGeldigheid": {
      "dag": 3,
      "datum": "1989-05-03",
      "jaar": 1989,
      "maand": 5
    },
    "datumInschrijvingInGemeente": {
      "dag": 3,
      "datum": "1989-05-03",
      "jaar": 1989,
      "maand": 5
    },
    "datumVestigingInNederland": {
      "dag": 3,
      "datum": "1989-05-03",
      "jaar": 1989,
      "maand": 5
    },
    "gemeenteVanInschrijving": {
      "code": "6030",
      "omschrijving": "Nederland"
    },
    "landVanwaarIngeschreven": {
      "code": "6030",
      "omschrijving": "Nederland"
    },
    "verblijfBuitenland": {
      "adresRegel1": "string",
      "adresRegel2": "string",
      "adresRegel3": "string",
      "vertrokkenOnbekendWaarheen": true,
      "land": {
        "code": "6030",
        "omschrijving": "Nederland"
      }
    },
    "inOnderzoek": {
      "aanduidingBijHuisnummer": true,
      "datumAanvangAdreshouding": true,
      "datumIngangGeldigheid": true,
      "datumInschrijvingInGemeente": true,
      "datumVestigingInNederland": true,
      "functieAdres": true,
      "gemeenteVanInschrijving": true,
      "huisletter": true,
      "huisnummer": true,
      "huisnummertoevoeging": true,
      "identificatiecodeNummeraanduiding": true,
      "identificatiecodeAdresseerbaarObject": true,
      "landVanwaarIngeschreven": true,
      "locatiebeschrijving": true,
      "naamOpenbareRuimte": true,
      "postcode": true,
      "straatnaam": true,
      "verblijfBuitenland": true,
      "woonplaatsnaam": true,
      "datumIngangOnderzoek": {
        "dag": 3,
        "datum": "1989-05-03",
        "jaar": 1989,
        "maand": 5
      }
    },
    "datumTot": {
      "dag": 3,
      "datum": "1989-05-03",
      "jaar": 1991,
      "maand": 5
    }, 
      "TestArrayAdressen": [
                  {  
                    "AdresNr" : 1,
                    "AdresNaam" : "Dorpsstraat",
                    "PlaatsNaam" : "Zaanstad",
                    "VanafDatum" : "1988-03-02",   
                    "TotDatum" : "1995-02-16"
                  },
                  {  
                    "AdresNr" : 2,
                    "AdresNaam" : "Roosendaalseweg",
                    "PlaatsNaam" : "Hoorn",
                    "VanafDatum" : "1995-02-16",   
                    "TotDatum" : "1995-02-16"
                  },
                  {  
                     "AdresNr" : 3,
                     "AdresNaam" : "Boekweitstraat",
                     "Plaatsnaam" : "Hoorn",
                     "VanafDatum" : "1995-02-16",   
                     "TotDatum" : "2016-12-30"
                  }
      ]
  }
  ))
  res.end()
})

app.listen(80)
