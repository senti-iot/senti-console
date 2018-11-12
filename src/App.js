import React, { Component } from 'react'

import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import { Provider } from 'react-redux'
import { store } from './redux/store'
import indexRoutes from "routes/index.js";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { primaryColor, secondaryColor, hoverColor } from "assets/jss/material-dashboard-react";
import "assets/css/material-dashboard-react.css?v=1.2.0";
import TProvider from 'components/Localization/TProvider';
import { teal, red } from "@material-ui/core/colors"

import "core-js/fn/set"; 
import 'core-js/es6/map';
import 'core-js/es6/set';
import 'core-js/fn/array/find';
import 'core-js/fn/array/includes';
import 'core-js/fn/number/is-nan';

var countries = require("i18n-iso-countries")
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
countries.registerLocale(require("i18n-iso-countries/langs/da.json"));

const hist = createBrowserHistory();
const theme = createMuiTheme({
	typography: {
		useNextVariants: true,
		suppressDeprecationWarnings: true,
	},
	overrides: {
		MuiButton: {
			text: {
				textTransform: "uppercase"
			}
		},
		MuiTypography: {
			// h6: {
			// 	textTransform: "none"
			// },
			// h5: {
			// 	textTransform: "none"
			// },
			// h4: {
			// 	textTransform: "none"
			// },
			body1: {
				fontSize: '0.875rem',
			}	
		},
		MuiFormControl: {
			root: {
				minWidth: 230,
				// width: "100%",
				// maxWidth: 230
			}
		},
		MuiIcon: {
			root: {
				overflow: 'visible',
			},
		},
		MuiFormLabel: {
			root: {
				'&$focused': {
					color: teal[500],
				},
			},
		},
		MuiTableCell: {
			root: {
				padding: '0px 8px'
			}
		},
		MuiInput: {
			// Name of the styleSheet
			underline: {
				'&:hover:not($disabled):not($focused):not($error):before': {
					borderBottom: "2px solid #4db6ac" /* + primaryColor */,
				},	
				'&:after': {
					borderBottomColor: teal[500],
				},
			}
			
			
		}
	},
	palette: {
		// type: 'dark',
		primary: {
			// light: will be calculated from palette.primary.main,
			main: primaryColor
		},
		secondary: {
			main: secondaryColor,
			light: hoverColor,
			// dark: will be calculated from palette.secondary.main,
		},
		error: {
			main: red[400]
		}
	},
});

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<TProvider>
					<MuiThemeProvider theme={theme}>
						<Router history={hist}>
							<Switch>
								{indexRoutes.map((prop, key) => {
									return <Route path={prop.path} component={prop.component} key={key} exact={prop.exact ? true : false} />;
								})}
							</Switch>
						</Router>
					</MuiThemeProvider>
				</TProvider>
			</Provider>
		)
	}
}


export default App