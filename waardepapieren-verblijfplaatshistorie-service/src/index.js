import WaardepapierenVerblijfplaatshistorieService from './waardepapieren-verblijfplaatshistorie-service'


import fs from 'fs'

let configurationPath = process.env.WAARDEPAPIEREN_VERBLIJFPLAATSHISTORIE_CONFIG || '../configuration/waardepapieren-verblijfplaatshistorie-config.json'

let configuration = JSON.parse(fs.readFileSync(configurationPath))

console.log('Booting with configuration: ', configuration)
console.log(configuration)


let waardenpapierenVerblijfplaatshistorieService = new WaardepapierenVerblijfplaatshistorieService()
waardenpapierenVerblijfplaatshistorieService.start(configuration)
