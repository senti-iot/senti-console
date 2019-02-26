import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'
import registerServiceWorker from './serviceWorker';

registerServiceWorker()
var rootEl = document.getElementById('root')
ReactDOM.render(<App />, rootEl)
if (module.hot) {
	module.hot.accept('./App', function () {
		var NextApp = require('./App').default
		ReactDOM.render(<NextApp />, rootEl)
	})
}