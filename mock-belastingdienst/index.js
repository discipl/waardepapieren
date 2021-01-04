var express = require('express')
var app = express()

app.get('/belastingdienst/bsn/999994669', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({
        "_embedded": {
            "gegevensbelastingdienst": [
                {
                    "burgerservicenummer": "999994669",
                    "naam": {
                        "voornamen": "Żáïŀëñøŕ Åłéèç Đëļŧå",
                        "voorletters": "Ż.Å.Đ.",
                        "geslachtsnaam": "Streeveld",
                        "voorvoegsel": "'S"
                    },
                    "geboortedatum": "10-12-1961",
                    "alimentatieverplichtingen": "geen",
                    "verplichtingenAndersDanBekendBijBKR": "geen",
                    "inkomenUitOnderneming": "geen",
                    "woningEnAndereOnroerendeZaken": "geen",
                    "fiscaalPartner": "geen",
                    "eigenBijdragePensioen": "56,73 euro"
                }]
        }
    }
    ))
    res.end()
})

const port = process.env.BELASTINGDIENST_MOCK_PORT | 80

app.listen(port)
