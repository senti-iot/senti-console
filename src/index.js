import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'
import registerServiceWorker from './serviceWorker';
// import NewContent from 'layouts/404/NewContent';

registerServiceWorker()
var rootEl = document.getElementById('root')
ReactDOM.render(<App />, rootEl)

// var rootUpdate = document.getElementById('update')
// ReactDOM.render(<NewContent />, rootUpdate)
if (module.hot) {
	module.hot.accept('./App', function () {
		var NextApp = require('./App').default
		ReactDOM.render(<NextApp />, rootEl)
	})
}