import { createMuiTheme } from '@material-ui/core/styles'
import { primaryColor, secondaryColor, hoverColor, sideBarColor, headerColor, /* headerColor */ } from 'assets/jss/material-dashboard-react'
import { red } from '@material-ui/core/colors'
import override from './overrides';
let defaultOptions = {
	theme: {
		light: {
			primary: primaryColor,
			secondary: secondaryColor,
			hover: hoverColor,
			headerColor: headerColor,
			sidebarColor: sideBarColor,
			background: '#eee',
			logo: undefined
		}
	}
}
const theme = (options = defaultOptions) => {
	console.log(options)
	return createMuiTheme({
		typography: {
			useNextVariants: true,
			suppressDeprecationWarnings: true,
		},
		...override(options.theme.light.primary, false),
		palette: {
			primary: {
				main: options.theme.light.primary
			},
			secondary: {
				main: options.theme.light.secondary,
				light: options.theme.light.hover,
			},
			error: {
				main: red[400]
			},
		},
		hover: options.theme.light.hover,
		header: options.theme.light.headerColor,
		sidebar: options.theme.light.sidebarColor,
		background: options.theme.light.background,
		logo: options.logoUrl
	});
}

export default theme