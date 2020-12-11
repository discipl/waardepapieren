var express = require('express')
var app = express()

app.get('/belastingdienst/bsn/995671239', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({
        "_embedded": {
            "gegevensbelastingdienst": [
                {
                    "burgerservicenummer": "995671239",
                    "naam": {
                        "voornamen": "Jan Hendrik",
                        "voorletters": "J.H.",
                        "geslachtsnaam": "de Jong",
                        "voorvoegsel": ""
                    },
                    "geboortedatum": "17-06-1989",
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