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
        let ephemeralConnector = await this.abundance.getCoreAPI().getConnector('ephemeral')
        let ephemeralEndpoint = process.env.REACT_APP_EPHEMERAL_ENDPOINT != null ? process.env.REACT_APP_EPHEMERAL_ENDPOINT : this.props.config.DEFAULT_EPHEMERAL_ENDPOINT
        let ephemeralWebsocketEndpoint = process.env.REACT_APP_EPHEMERAL_WEBSOCKET_ENDPOINT != null ? process.env.REACT_APP_EPHEMERAL_WEBSOCKET_ENDPOINT : this.props.config.DEFAULT_EPHEMERAL_WEBSOCKET_ENDPOINT
        ephemeralConnector.configure(ephemeralEndpoint, ephemeralWebsocketEndpoint, window.WebSocket)

        if (this.props.config.ENABLE_IPV8_ATTESTATION) {
            await this.abundance.getCoreAPI().registerConnector('ipv8', new Ipv8Connector())
            let ipv8Connector = await this.abundance.getCoreAPI().getConnector('ipv8')
            ipv8Connector.configure('https://localhost/api/ipv8/site')

            // Watch for verification request where the app is the requester and approve  those
            const appDid = 'did:discipl:ipv8:TGliTmFDTFBLOnj5S5VTowiIEV3QELnWusYPUBoiJ4vXtjeznhUUHdF6CbkMsP7H4PZwESO4LPHByqZHyEkjnM986nRQ2Bit76U='
            const siteDid = 'did:discipl:ipv8:TGliTmFDTFBLOpd7y5Yd9NDKxelDmsACx9I6Go2cK4v8fKBIKzp0KiEjStqcAfSHFfk7KkqbUodAH0iX3nljnd7Y+bj8b0oFUCI='
            const core = await this.abundance.getCoreAPI()

            const verificationRequestsObserve = await core.observeVerificationRequests(siteDid, { did: appDid }, {did: null, privkey: null})
            await verificationRequestsObserve.subscribe(request => {
                ipv8Connector.ipv8AttestationClient.allowVerify(request.verifier.mid, request.claim.data)
            })
        }
    }

    render() {
        return (
            <NeedWizard core={this.abundance.getCoreAPI()} config={this.props.config}/>
        );
    }
}

export default App;
