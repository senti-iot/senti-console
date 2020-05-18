import React, { useState } from 'react'
import { createBrowserHistory } from 'history'
import { Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import configureStore from './redux/store'
import 'assets/css/material-dashboard-react.css?v=1.2.0'
import 'assets/css/leaflet.css'

import TProvider from 'components/Localization/TProvider'
import 'core-js/es/map'
import 'core-js/es/set'
// import 'core-js/find';
import 'core-js/features/set'
import 'core-js/features/array/find'
import 'core-js/features/array/includes'
import 'core-js/features/number/is-nan'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'
import { DndProvider } from 'react-dnd'
import { StylesProvider } from "@material-ui/styles"

import TouchBackend from 'react-dnd-touch-backend'
import HTML5Backend from 'react-dnd-html5-backend'
import LocalizationProvider from 'hooks/providers/LocalizationProvider'
import SnackbarProvider from 'hooks/providers/SnackbarProvider'
import { getWhiteLabel } from 'variables/data'
import { setWL } from 'variables/storage'
import FadeOutLoader from 'components/Utils/FadeOutLoader/FadeOutLoader'
import { ThemeProvider } from 'ThemeProvider'
import { hot } from 'react-hot-loader/root'
import AuthProvider from 'hooks/providers/AuthProvider'
// import Base from './Base'

var countries = require('i18n-iso-countries')
countries.registerLocale(require('i18n-iso-countries/langs/en.json'))
countries.registerLocale(require('i18n-iso-countries/langs/da.json'))

export const store = configureStore()
export const hist = createBrowserHistory()

const Providers = props => {

	const [loading, setLoading] = useState(true)
	const loaderFunc = async () => {
		let getWL = async () => await getWhiteLabel(window.location.hostname)
		getWL().then(rs => {
			setWL(rs)

			// window.location.reload()
			setLoading(false)

		})
	}

	let width = window.innerWidth
	return <StylesProvider injectFirst>
		<Provider store={store}>
			<FadeOutLoader on={loading} onChange={loaderFunc} fillView={true}>
				<ThemeProvider>
					<DndProvider backend={width < 1280 ? TouchBackend : HTML5Backend}>
						<MuiPickersUtilsProvider utils={MomentUtils}>
							<LocalizationProvider>
								<SnackbarProvider>
									<TProvider>
										<AuthProvider>
											<Router history={hist} key={Math.random()}>
												{props.children}
											</Router>
										</AuthProvider>
									</TProvider>
								</SnackbarProvider>
							</LocalizationProvider>
						</MuiPickersUtilsProvider>
					</DndProvider>
				</ThemeProvider>
			</FadeOutLoader>
		</Provider>
	</StylesProvider>

}
const HotProviders = hot(Providers)
export default HotProviders