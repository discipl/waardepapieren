import WaardepapierenService from './waardepapieren-service'


import fs from 'fs'

let configurationPath = process.env.WAARDEPAPIEREN_CONFIG || '../configuration/waardepapieren-config.json'

let configuration = JSON.parse(fs.readFileSync(configurationPath))

console.log('Booting with configuration: ', configuration)
console.log(configuration)


let waardenpapierenService = new WaardepapierenService()
waardenpapierenService.start(configuration)
