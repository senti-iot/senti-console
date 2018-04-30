import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'
import './index.css'
import Login from 'Login'
import 'react-dates/initialize'
import { CookiesProvider } from 'react-cookie'

ReactDOM.render(
	<CookiesProvider><Login /></CookiesProvider>,
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

