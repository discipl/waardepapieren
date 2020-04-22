const ENDPOINT = 'https://localhost:443'

describe('clerk-frontend', () => {
  it('Allows a clerk to request waardepapieren', () => {
    cy.visit('')
    cy.contains('Verstrekken waardepapier')

    cy.get('.bsn-form input')
      .type('999994669')

    cy.contains('Volgende').click()

    cy.contains("Uittreksel Basis Registratie Persoonsgegevens")

    cy.contains('Volgende').click()

    cy.contains('p', 'Rotterdam', { 'timeout': 30000 })

    cy.contains('Dit klopt!').click()

    cy.get('canvas').should((canvasArray) => {
      let canvas = canvasArray[0]
      let context = canvas.getContext('2d')
      // This a pixel just from the top left of the QR code based on the offset
      let pixel = context.getImageData(549, 699, 1, 1)
      expect(pixel.data).to.deep.equal(new Uint8ClampedArray([255, 255, 255, 255]))
    })

  })
})
