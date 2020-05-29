import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

fetch(window.waardepapierenConfigUrl || 'https://localhost/clerk-frontend-config.json').then(
    (response) => response.json())
    .then((config) => {
        console.log("config", config)
        ReactDOM.render(<App config={config} />, document.getElementById(config.CONTAINER_ID));
    }
)
