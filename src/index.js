// import '@babel/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'
import registerServiceWorker from './serviceWorker';
// import NewContent from 'layouts/404/NewContent';

// serviceWorker.unregister();
// Service Worker is disabled until the project is delivered fully
registerServiceWorker()
var rootEl = document.getElementById('root')
ReactDOM.render(<App />, rootEl)

// if (process.env.NODE_ENV !== 'production') {
// 	const { whyDidYouUpdate } = require('why-did-you-update');
// 	whyDidYouUpdate(React, { exclude: [/^Connect/, /^Route/, /^NoSsr/] });
// }
//New Content Dialog Debug
// var rootUpdate = document.getElementById('update')
// ReactDOM.render(<NewContent installing/>, rootUpdate)
// setTimeout(() => {
// 	ReactDOM.unmountComponentAtNode(rootUpdate)
// 	ReactDOM.render(<NewContent />, rootUpdate)
// }, 4000);
// Are we in development mode?
if (module.hot) {
	// Whenever a new version of App.js is available
	module.hot.accept('./App', function () {
		// Require the new version and render it instead
		var NextApp = require('./App').default
		ReactDOM.render(<NextApp />, rootEl)
	})
}