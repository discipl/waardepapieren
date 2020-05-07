import React, {Component} from 'react';
import NeedWizard from './need-wizard/NeedWizard'
import { AbundanceService } from '@discipl/abundance-service'
import EphemeralConnector from '@discipl/core-ephemeral'
import Ipv8Connector from '@discipl/core-ipv8';






class App extends Component {
    constructor(props) {
        super(props)

        this.abundance = new AbundanceService()
    }
    async componentDidMount() {
        console.log(new EphemeralConnector().getName())
        await this.abundance.getCoreAPI().registerConnector('ephemeral', new EphemeralConnector())
        await this.abundance.getCoreAPI().registerConnector('ipv8', new Ipv8Connector())
        let ephemeralConnector = await this.abundance.getCoreAPI().getConnector('ephemeral')
        let ephemeralEndpoint = process.env.REACT_APP_EPHEMERAL_ENDPOINT != null ? process.env.REACT_APP_EPHEMERAL_ENDPOINT : this.props.config.DEFAULT_EPHEMERAL_ENDPOINT
        let ephemeralWebsocketEndpoint = process.env.REACT_APP_EPHEMERAL_WEBSOCKET_ENDPOINT != null ? process.env.REACT_APP_EPHEMERAL_WEBSOCKET_ENDPOINT : this.props.config.DEFAULT_EPHEMERAL_WEBSOCKET_ENDPOINT
        ephemeralConnector.configure(ephemeralEndpoint, ephemeralWebsocketEndpoint, window.WebSocket)

        let ipv8Connector = await this.abundance.getCoreAPI().getConnector('ipv8')
        ipv8Connector.configure('https://localhost/api/ipv8/site')
    }

    render() {
        return (
            <NeedWizard core={this.abundance.getCoreAPI()} config={this.props.config}/>
        );
    }
}

export default App;
