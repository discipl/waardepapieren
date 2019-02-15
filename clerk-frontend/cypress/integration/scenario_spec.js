const ENDPOINT = 'http://localhost:8080'

describe('clerk-frontend', () => {
  it('Allows a clerk to request waardepapieren', () => {
    cy.visit('')
    cy.contains('Verstrekken bewijs inschrijving BRP')

    cy.get('.bsn-form input')
      .type('123123123')

    cy.contains('Volgende').click()

    cy.contains("Uittreksel Basis Registratie Persoonsgegevens")

    cy.contains('Volgende').click()

    cy.contains('woonplaats')

    cy.contains('Volgende').click()

    cy.get('canvas').should((canvasArray) => {
      let canvas = canvasArray[0]
      let context = canvas.getContext('2d')
      // This a pixel just from the top left of the QR code based on the offset
      let pixel = context.getImageData(227, 202, 1, 1)
      expect(pixel.data).to.deep.equal(new Uint8ClampedArray([255, 255, 255, 255]))
    })

  })
})