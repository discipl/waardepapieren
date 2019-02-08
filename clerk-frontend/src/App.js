import React, {Component} from 'react';
import NeedWizard from './need-wizard/NeedWizard'
import * as abundance from '@discipl/abundance-service'
// Specifically import the subcomponent to prevent the server to be included in the distributable
import EphemeralConnector from '@discipl/core-ephemeral'

const EPHEMERAL_ENDPOINT = 'http://localhost:3000'
const EPHEMERAL_WEBSOCKET_ENDPOINT = 'ws://localhost:3233'





class App extends Component {
    async componentDidMount() {
        console.log(new EphemeralConnector().getName())
        await abundance.getCoreAPI().registerConnector('ephemeral', new EphemeralConnector())
        let ephemeralConnector = await abundance.getCoreAPI().getConnector('ephemeral')
        let ephemeralEndpoint = process.env.REACT_APP_EPHEMERAL_ENDPOINT != null ? process.env.REACT_APP_EPHEMERAL_ENDPOINT : EPHEMERAL_ENDPOINT
        let ephemeralWebsocketEndpoint = process.env.REACT_APP_EPHEMERAL_WEBSOCKET_ENDPOINT != null ? process.env.REACT_APP_EPHEMERAL_WEBSOCKET_ENDPOINT : EPHEMERAL_WEBSOCKET_ENDPOINT
        ephemeralConnector.configure(ephemeralEndpoint, ephemeralWebsocketEndpoint, window.WebSocket)
    }

    render() {
        return (
            <NeedWizard/>
        );
    }
}

export default App;
