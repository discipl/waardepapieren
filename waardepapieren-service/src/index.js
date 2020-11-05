import WaardepapierenService from './waardepapieren-service'


import fs from 'fs'

let configurationPath = process.env.WAARDEPAPIEREN_CONFIG
let configuration = JSON.parse(fs.readFileSync(configurationPath))

configuration.ULA_SERVER_ENDPOINT = process.env.ULA_SERVER_ENDPOINT
configuration.ULA_BASIC_AUTH = process.env.ULA_BASIC_AUTH

console.log('Booting with configuration: ', configuration)


let waardenpapierenService = new WaardepapierenService()
waardenpapierenService.start(configuration)
