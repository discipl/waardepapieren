const ENDPOINT = 'https://localhost:443'

describe('clerk-frontend', () => {
  it('Allows a client to request a mortgage', () => {
    cy.visit('')
    cy.contains('Hypotheek aanvraag')

    cy.contains('Volgende').click()

    cy.contains("Scan de QR code met je IDA wallet om deze gegevens te delen")

    cy.wait("15000")

    cy.contains('Volgende').click()

    cy.contains('li', 'Streeveld', { 'timeout': 30000 })

    cy.contains('Afronden').click()

    cy.contains("Bedankt voor je hypotheekaanvraag bij ICTUbank")

  })
})
