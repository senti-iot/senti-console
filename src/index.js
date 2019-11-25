import React from 'react';
import ReactDOM from 'react-dom';
import Providers from './Providers'
import registerServiceWorker from './serviceWorker';
// import NewContent from 'layouts/404/NewContent';
import whyDidYouRender from "@welldone-software/why-did-you-render";

if (process.env.NODE_ENV !== 'production') {
	whyDidYouRender(React, {
		collapseGroups: true,
		trackHooks: true,
		onlyLogs: true,
		titleColor: "green",
		diffNameColor: "darkturquoise"
	});
}

registerServiceWorker()
var rootEl = document.getElementById('root')
ReactDOM.render(<Providers />, rootEl)

// var rootUpdate = document.getElementById('update')
// ReactDOM.render(<NewContent />, rootUpdate)
if (module.hot) {
	module.hot.accept('./Providers', function () {
		var NextApp = require('./Providers').default
		ReactDOM.render(<NextApp />, rootEl)
	})
}