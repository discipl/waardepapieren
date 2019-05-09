import React, {Component} from 'react';
import NeedWizard from './need-wizard/NeedWizard'
import * as abundance from '@discipl/abundance-service'
import EphemeralConnector from '@discipl/core-ephemeral'

import CONFIGURATION from './configuration/clerk-frontend-config'





class App extends Component {
    async componentDidMount() {
        console.log(new EphemeralConnector().getName())
        await abundance.getCoreAPI().registerConnector('ephemeral', new EphemeralConnector())
        let ephemeralConnector = await abundance.getCoreAPI().getConnector('ephemeral')
        let ephemeralEndpoint = process.env.REACT_APP_EPHEMERAL_ENDPOINT != null ? process.env.REACT_APP_EPHEMERAL_ENDPOINT : CONFIGURATION.DEFAULT_EPHEMERAL_ENDPOINT
        let ephemeralWebsocketEndpoint = process.env.REACT_APP_EPHEMERAL_WEBSOCKET_ENDPOINT != null ? process.env.REACT_APP_EPHEMERAL_WEBSOCKET_ENDPOINT : CONFIGURATION.DEFAULT_EPHEMERAL_WEBSOCKET_ENDPOINT
        ephemeralConnector.configure(ephemeralEndpoint, ephemeralWebsocketEndpoint, window.WebSocket)
    }

    render() {
        return (
            <NeedWizard/>
        );
    }
}

export default App;
