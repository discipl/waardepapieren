var express = require('express')
var app = express()

app.get('/brp/basisregistratie/natuurlijke_personen/bsn/999994669', (req, res) => {
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
                    "geboortedatum": "1989-06-17",
                    "alimentatieverplichtingen": "geen",
                    "verplichtingenAndersDanBekendBijBKR": "geen",
                    "inkomenUitOnderneming": "geen",
                    "woningEnAndereOnroerendeZaken": "geen",
                    "fiscaalPartner": "geen",
                    "eigenBijdragePensioen": "€50"
                }]
        }
    }
    ))
    res.end()
})