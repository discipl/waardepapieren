import React, {Component} from 'react';
import NeedWizard from './need-wizard/NeedWizard'
import { AbundanceService } from '@discipl/abundance-service'
import EphemeralConnector from '@discipl/core-ephemeral'

import CONFIGURATION from './configuration/clerk-frontend-config'





class App extends Component {
    constructor(props) {
        super(props)

        this.abundance = new AbundanceService()
    }
    async componentDidMount() {
        console.log(new EphemeralConnector().getName())
        await this.abundance.getCoreAPI().registerConnector('ephemeral', new EphemeralConnector())
        let ephemeralConnector = await this.abundance.getCoreAPI().getConnector('ephemeral')
        let ephemeralEndpoint = process.env.REACT_APP_EPHEMERAL_ENDPOINT != null ? process.env.REACT_APP_EPHEMERAL_ENDPOINT : CONFIGURATION.DEFAULT_EPHEMERAL_ENDPOINT
        let ephemeralWebsocketEndpoint = process.env.REACT_APP_EPHEMERAL_WEBSOCKET_ENDPOINT != null ? process.env.REACT_APP_EPHEMERAL_WEBSOCKET_ENDPOINT : CONFIGURATION.DEFAULT_EPHEMERAL_WEBSOCKET_ENDPOINT
        ephemeralConnector.configure(ephemeralEndpoint, ephemeralWebsocketEndpoint, window.WebSocket)
    }

    render() {
        return (
            <NeedWizard core={this.abundance.getCoreAPI()}/>
        );
    }
}

export default App;
