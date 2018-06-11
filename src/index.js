import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'
import './index.css'
import Login from 'Login'
import 'react-dates/initialize'
import { createMuiTheme } from '@material-ui/core'
const theme = createMuiTheme({
	palette: {
		primary: {
			light: '#757ce8',
			main: '#3f50b5',
			dark: '#002884',
			contrastText: '#fff',
		},
		secondary: {
			light: '#ff7961',
			main: '#f44336',
			dark: '#ba000d',
			contrastText: '#000',
		},
	},
})
ReactDOM.render(
	<Login />,
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

