import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'
import './index.css'
import App from 'App'
import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'

ReactDOM.render(
	<App />,
	document.getElementById('root')
)

if (module.hot) {
	module.hot.accept('./index'.default, () => {
		const NextApp = require('./index').default
		ReactDOM.render(
			<NextApp />,
			document.getElementById('root')
		)
	})
}

registerServiceWorker()

