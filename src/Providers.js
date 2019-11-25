import React from 'react'
import { createBrowserHistory } from 'history'
import { Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store'
import indexRoutes from 'routes/index.js'
import 'assets/css/material-dashboard-react.css?v=1.2.0'
import 'assets/css/leaflet.css'

// import 'react-grid-layout/css/styles.css'
// import 'react-resizable/css/styles.css'

import TProvider from 'components/Localization/TProvider'
import 'core-js/es/map';
import 'core-js/es/set';
// import 'core-js/find';
import 'core-js/features/set';
import 'core-js/features/array/find'
import 'core-js/features/array/includes';
import 'core-js/features/number/is-nan';
import { MuiThemeProvider } from '@material-ui/core';
import { lightTheme } from 'variables/themes';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import { DndProvider } from 'react-dnd'
import { StylesProvider } from "@material-ui/styles";

import TouchBackend from 'react-dnd-touch-backend';
import HTML5Backend from 'react-dnd-html5-backend'
import LocalizationProvider from 'hooks/providers/LocalizationProvider'
import SnackbarProvider from 'hooks/providers/SnackbarProvider'

var countries = require('i18n-iso-countries')
countries.registerLocale(require('i18n-iso-countries/langs/en.json'))
countries.registerLocale(require('i18n-iso-countries/langs/da.json'))

export const hist = createBrowserHistory();


function Providers() {
	let width = window.ineerWidth
	return <StylesProvider injectFirst>
		<Provider store={store}>
			<DndProvider backend={width < 1280 ? TouchBackend : HTML5Backend}>
				<MuiPickersUtilsProvider utils={MomentUtils}>
					<SnackbarProvider>
						<LocalizationProvider>
							<TProvider>
								<MuiThemeProvider theme={lightTheme}>
									<Router history={hist}>
										<Switch>
											{indexRoutes.map((prop, key) => {
												return <Route path={prop.path} key={key} exact={prop.exact ? true : false} >
													<prop.component />
												</Route>;
											})}
										</Switch>
									</Router>
								</MuiThemeProvider>
							</TProvider>
						</LocalizationProvider>
					</SnackbarProvider>
				</MuiPickersUtilsProvider>
			</DndProvider>
		</Provider>
	</StylesProvider>

}


export default Providers