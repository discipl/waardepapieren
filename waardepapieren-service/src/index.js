import WaardepapierenService from './waardepapieren-service'
import configuration from '../configuration/wpsvc.json'

configuration.NLX_OUTWAY_ENDPOINT = process.env.NLX_OUTWAY_ENDPOINT || 'http://localhost:4080'

let waardenpapierenService = new WaardepapierenService()
waardenpapierenService.start(configuration)
