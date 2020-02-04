import React from 'react';
import ReactDOM from 'react-dom';
import Providers from './Providers'
import * as serviceWorker from './serviceWorker';

import store from 'redux/store';
import { updateServiceworker } from 'redux/serviceWorkerRedux';

import whyDidYouRender from "@welldone-software/why-did-you-render";

if (process.env.NODE_ENV !== 'production') {
	whyDidYouRender(React, {
		onlyLogs: true,
		titleColor: "green",
		diffNameColor: "darkturquoise"
	});

}

const onUpdate = () => {
	store.dispatch(updateServiceworker())
}
serviceWorker.register({ onUpdate: onUpdate });

var rootEl = document.getElementById('root')
ReactDOM.render(<Providers />, rootEl)

// var rootUpdate = document.getElementById('update')
// ReactDOM.render(<NewContent />, rootUpdate)
//Hello Pavel
// Pavel says hello
if (module.hot) {
	module.hot.accept('./Providers', function () {
		var NextApp = require('./Providers').default
		ReactDOM.render(<NextApp />, rootEl)
	})
}