var express = require('express')
var app = express()

app.get('/uwv/bsn/999852147', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify({
    "_embedded": {
        "gegevensuwv": [
            {
                "burgerservicenummer": "999852147",
                "naam": {
                    "volledigeNaam": "Tyra Andersson",
                    "voornamen": "Tyra",
                    "voorletters": "T",
                    "geslachtsnaam": "Andersson",
                    "voorvoegsel": ""
                },
                "geboortedatum": "05-11-1977",
                "aantalUurAfgelopenMaandMeerDanNul": "Ja",
                "aantalUurAfgelopenDrieMaanden": "480",
                "aantalUurAfgelopenTwaalfMaanden": "1920",
                "minimaal24MaandenWerkgever": "Ja",
                "typeArbeidsovereenkomst": "Onbepaalde tijd",
                "schriftelijkeArbeidsovereenkomst": "Ja",
                "oproepovereenkomst": "Nee",
                "SVLoonPerMaand": "20.700 euro",
                "werkgever": "UWV",
                "proeftijdVerstreken": "Ja",
                "autoVanZaak": "Nee"                
            }
        ]
    }
  }
  ))
  res.end()
})

const port = process.env.NLX_UWV_PORT | 80

app.listen(port)
