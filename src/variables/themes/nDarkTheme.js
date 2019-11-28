import { createMuiTheme } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors'
import override from './overrides';

const theme = (options) => createMuiTheme({
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
	logo: options.logoUrl
});

export default theme