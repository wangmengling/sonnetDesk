import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import './index.less';
import App from './App';
import Routes from "./Routes";
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <Routes />,
    document.getElementById('root')
);
registerServiceWorker();