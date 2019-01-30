import React, {Component} from 'react';
import NeedWizard from './need-wizard/NeedWizard'
import * as abundance from 'discipl-abundance-service'
import EphemeralConnector from 'discipl-core-ephemeral/src/client'

const EPHEMERAL_ENDPOINT = 'http://localhost:3000'
const EPHEMERAL_WEBSOCKET_ENDPOINT = 'ws://localhost:3233'





class App extends Component {
    async componentDidMount() {
        console.log(new EphemeralConnector().getName())
        await abundance.getCoreAPI().registerConnector('ephemeral', new EphemeralConnector())
        let ephemeralConnector = await abundance.getCoreAPI().getConnector('ephemeral')
        ephemeralConnector.configure(EPHEMERAL_ENDPOINT, EPHEMERAL_WEBSOCKET_ENDPOINT, window.WebSocket)
    }

    render() {
        return (
            <NeedWizard/>
        );
    }
}

export default App;
