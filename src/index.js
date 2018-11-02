import React from "react";
import ReactDOM from "react-dom";
import App from './App'
import registerServiceWorker from './serviceWorker';
// import NewContent from 'layouts/404/NewContent';

// serviceWorker.unregister();
// Service Worker is disabled until the project is delivered fully
registerServiceWorker()
var rootEl = document.getElementById('root')
ReactDOM.render(<App />, rootEl)

//New Content Dialog Debug
// var rootUpdate = document.getElementById("update")
// ReactDOM.render(<NewContent />, rootUpdate)

// Are we in development mode?
if (module.hot) {
	// Whenever a new version of App.js is available
	module.hot.accept('./App', function () {
		// Require the new version and render it instead
		var NextApp = require('./App').default
		ReactDOM.render(<NextApp />, rootEl)
	})
}