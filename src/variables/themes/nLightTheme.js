import { createMuiTheme } from '@material-ui/core/styles'
import { primaryColor, secondaryColor, hoverColor, /* headerColor */ } from 'assets/jss/material-dashboard-react'
import { teal, red, grey } from '@material-ui/core/colors'
import override from './overrides';

const theme = (options) => createMuiTheme({
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

export default theme