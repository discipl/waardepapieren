import WaardepapierenService from './waardepapieren-service'


import fs from 'fs'

let configurationPath = process.env.WAARDEPAPIEREN_CONFIG
let configuration = JSON.parse(fs.readFileSync(configurationPath))

console.log('Booting with configuration: ', configuration)


let waardenpapierenService = new WaardepapierenService()
waardenpapierenService.start(configuration)
