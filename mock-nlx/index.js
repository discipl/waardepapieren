var express = require('express')
var app = express()

//
// Test data in compliance with test use case officially offered via RvIG for BSN 999994669
// See: https://www.rvig.nl/documenten/richtlijnen/2018/09/20/testdataset-persoonslijsten-proefomgevingen-gba-v
//
app.get('/brp/basisregistratie/natuurlijke_personen/bsn/999994669', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify({
    "_links": {
        "self": {
            "href": "https://www.haalcentraal.nl/haalcentraal/api/brp/ingeschrevenpersonen?burgerservicenummer=999994669"
        }
    },
    "_embedded": {
        "ingeschrevenpersonen": [
            {
                "_links": {
                    "self": {
                        "href": "https://www.haalcentraal.nl/haalcentraal/api/brp/ingeschrevenpersonen/999994669"
                    },
                    "ouders": [
                        {
                            "href": "https://www.haalcentraal.nl/haalcentraal/api/brp/ingeschrevenpersonen/999994669/ouders/1"
                        },
                        {
                            "href": "https://www.haalcentraal.nl/haalcentraal/api/brp/ingeschrevenpersonen/999994669/ouders/2"
                        }
                    ],
                    "kinderen": [
                        {
                            "href": "https://www.haalcentraal.nl/haalcentraal/api/brp/ingeschrevenpersonen/999994669/kinderen/1"
                        },
                        {
                            "href": "https://www.haalcentraal.nl/haalcentraal/api/brp/ingeschrevenpersonen/999994669/kinderen/2"
                        }
                    ],
                    "partnerhistorie": {
                        "href": "https://www.haalcentraal.nl/haalcentraal/api/brp/ingeschrevenpersonen/999994669/partnerhistorie"
                    },
                    "partners": [
                        {
                            "href": "https://www.haalcentraal.nl/haalcentraal/api/brp/ingeschrevenpersonen/999994669/partners/1"
                        }
                    ],
                    "verblijfplaatshistorie": {
                        "href": "https://www.haalcentraal.nl/haalcentraal/api/brp/ingeschrevenpersonen/999994669/verblijfplaatshistorie"
                    },
                    "verblijfstitelhistorie": {
                        "href": "https://www.haalcentraal.nl/haalcentraal/api/brp/ingeschrevenpersonen/999994669/verblijfstitelhistorie"
                    },
                    "verblijfplaatsNummeraanduiding": {
                        "href": "https://api.test.kadaster.nl/lvbag/api/huidigebevragingen/vhc/nummeraanduidingen/0599200000316239"
                    }
                },
                "geslachtsaanduiding": "vrouw",
                "naam": {
                    "aanhef": "Geachte mevrouw 'S Streeveld-te Schaars",
                    "aanschrijfwijze": "jonkvrouw Ż.Å.Đ. 'S Streeveld-te Schaars",
                    "gebruikInLopendeTekst": "jonkvrouw 'S Streeveld-te Schaars",
                    "aanduidingNaamgebruik": "eigen_partner",
                    "voornamen": "Żáïŀëñøŕ Åłéèç Đëļŧå",
                    "voorletters": "Ż.Å.Đ.",
                    "geslachtsnaam": "Streeveld",
                    "voorvoegsel": "'S"
                },
                "leeftijd": 58,
                "nationaliteit": [
                    {
                        "nationaliteit": {
                            "code": "0001",
                            "omschrijving": "Nederlandse"
                        }
                    }
                ],
                "verblijfplaats": {
                    "functieAdres": "woonadres",
                    "identificatiecodeNummeraanduiding": "0599200000316239",
                    "identificatiecodeAdresseerbaarObject": "0599010000287986",
                    "huisnummer": 4,
                    "woonplaatsnaam": "Rotterdam",
                    "naamOpenbareRuimte": "Johan in 't Veltstraat",
                    "postcode": "3078JG",
                    "straatnaam": "Johan in 't Veltstraat",
                    "indicatieVestigingVanuitBuitenland": true,
                    "gemeenteVanInschrijving": {
                        "code": "0599",
                        "omschrijving": "Rotterdam"
                    },
                    "datumVestigingInNederland": {
                        "datum": "1993-09-10",
                        "jaar": 1993,
                        "maand": 9,
                        "dag": 10
                    },
                    "datumAanvangAdreshouding": {
                        "datum": "1994-05-08",
                        "jaar": 1994,
                        "maand": 5,
                        "dag": 8
                    },
                    "datumInschrijvingInGemeente": {
                        "datum": "1992-05-08",
                        "jaar": 1992,
                        "maand": 5,
                        "dag": 8
                    }
                },
                "burgerservicenummer": "999994669",
                "geboorte": {
                    "datum": {
                        "datum": "1961-12-30",
                        "jaar": 1961,
                        "maand": 12,
                        "dag": 30
                    },
                    "plaats": {
                        "code": "0402",
                        "omschrijving": "Hilversum"
                    },
                    "land": {
                        "code": "6030",
                        "omschrijving": "Nederland"
                    }
                }
            }
        ]
    }
  }
  ))
  res.end()
})

//
// Test data in compliance with test use case officially offered via RvIG for BSN 999994669
// See: https://www.rvig.nl/documenten/richtlijnen/2018/09/20/testdataset-persoonslijsten-proefomgevingen-gba-v
//
app.get('/brp/basisregistratie/verblijfplaatshistorie/bsn/999994669', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify({
    "_links": {
        "self": {
            "href": "https://www.haalcentraal.nl/haalcentraal/api/brp/ingeschrevenpersonen/999994669/verblijfplaatshistorie"
        }
    },
    "_embedded": {
        "verblijfplaatshistorie": [
            {
                "functieAdres": "woonadres",
                "identificatiecodeNummeraanduiding": "0599200000316239",
                "identificatiecodeAdresseerbaarObject": "0599010000287986",
                "huisnummer": 4,
                "woonplaatsnaam": "Rotterdam",
                "naamOpenbareRuimte": "Johan in 't Veltstraat",
                "postcode": "3078JG",
                "straatnaam": "Johan in 't Veltstraat",
                "indicatieVestigingVanuitBuitenland": true,
                "gemeenteVanInschrijving": {
                    "code": "0599",
                    "omschrijving": "Rotterdam"
                },
                "datumVestigingInNederland": {
                    "datum": "1993-09-10",
                    "jaar": 1993,
                    "maand": 9,
                    "dag": 10
                },
                "datumAanvangAdreshouding": {
                    "datum": "1994-05-08",
                    "jaar": 1994,
                    "maand": 5,
                    "dag": 8
                },
                "datumInschrijvingInGemeente": {
                    "datum": "1992-05-08",
                    "jaar": 1992,
                    "maand": 5,
                    "dag": 8
                }
            },
            {
                "functieAdres": "woonadres",
                "locatiebeschrijving": "Woonboot \"'t Lelijk Eentje\"",
                "woonplaatsnaam": "Rotterdam",
                "indicatieVestigingVanuitBuitenland": true,
                "gemeenteVanInschrijving": {
                    "code": "0599",
                    "omschrijving": "Rotterdam"
                },
                "datumVestigingInNederland": {
                    "datum": "1993-09-10",
                    "jaar": 1993,
                    "maand": 9,
                    "dag": 10
                },
                "datumAanvangAdreshouding": {
                    "datum": "1993-09-10",
                    "jaar": 1993,
                    "maand": 9,
                    "dag": 10
                },
                "datumInschrijvingInGemeente": {
                    "datum": "1992-05-08",
                    "jaar": 1992,
                    "maand": 5,
                    "dag": 8
                },
                "datumTot": {
                    "datum": "1994-05-08",
                    "jaar": 1994,
                    "maand": 5,
                    "dag": 8
                }
            },
            {
                "gemeenteVanInschrijving": {
                    "code": "0402",
                    "omschrijving": "Hilversum"
                },
                "datumAanvangAdreshouding": {
                    "datum": "1993-02-15",
                    "jaar": 1993,
                    "maand": 2,
                    "dag": 15
                },
                "datumInschrijvingInGemeente": {
                    "datum": "1961-12-30",
                    "jaar": 1961,
                    "maand": 12,
                    "dag": 30
                },
                "verblijfBuitenland": {
                    "land": {
                        "code": "8027",
                        "omschrijving": "Kiribati"
                    }
                },
                "datumTot": {
                    "datum": "1993-09-10",
                    "jaar": 1993,
                    "maand": 9,
                    "dag": 10
                }
            },
            {
                "functieAdres": "woonadres",
                "huisnummer": 2,
                "woonplaatsnaam": "Hilversum",
                "postcode": "1213VK",
                "straatnaam": "Curaçaolaan",
                "gemeenteVanInschrijving": {
                    "code": "0402",
                    "omschrijving": "Hilversum"
                },
                "datumAanvangAdreshouding": {
                    "datum": "1961-12-30",
                    "jaar": 1961,
                    "maand": 12,
                    "dag": 30
                },
                "datumInschrijvingInGemeente": {
                    "datum": "1961-12-30",
                    "jaar": 1961,
                    "maand": 12,
                    "dag": 30
                },
                "datumTot": {
                    "datum": "1993-02-15",
                    "jaar": 1993,
                    "maand": 2,
                    "dag": 15
                }
            }
        ]
    }
  }
  ))
  res.end()
})

app.listen(80)
