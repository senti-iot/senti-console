import { createMuiTheme } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors'
import override from './overrides';
import { primaryColor, secondaryColor, hoverColor, sideBarColor, headerColor } from 'assets/jss/material-dashboard-react';

let defaultOptions = {
	theme: {
		dark: {
			primary: primaryColor,
			secondary: secondaryColor,
			hover: hoverColor,
			headerColor: headerColor,
			sidebarColor: sideBarColor,
			background: '#2e2e2e',
			logo: undefined
		}
	}
}
const theme = (options = defaultOptions) => {
	return createMuiTheme({
		typography: {
			useNextVariants: true,
			suppressDeprecationWarnings: true,
		},
		...override(options.theme.dark.primary, true),
		palette: {
			type: 'dark',
			primary: {
				main: options.theme.dark.primary
			},
			secondary: {
				main: options.theme.dark.secondary,
				light: options.theme.dark.hover,
			},
			error: {
				main: red[400]
			},
		},
		hover: options.theme.dark.hover,
		header: options.theme.dark.headerColor,
		sidebar: options.theme.dark.sidebarColor,
		background: options.theme.dark.background,
		toolbarBackground: options.theme.dark.toolbarBackground,
		toolbarIndicator: options.theme.dark.toolbarIndicator,
		logo: options.logoUrl
	})
};

export default theme