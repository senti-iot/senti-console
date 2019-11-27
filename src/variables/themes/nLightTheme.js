import { createMuiTheme, lighten } from '@material-ui/core/styles'
import override from './overrides'
import * as colors from '@material-ui/core/colors';

/*
headerColor: "#EEEEEE"
hover: "#0000DD"
primary: "#000088"
secondary: "#880000"
sidebarColor: "#EEEEEE"
 */
const theme = (options) => createMuiTheme({
	...override(options.theme.light.primary),
	logo: options.logoUrl,
	palette: {
		type: "light",
		primary: {
			main: options.theme.light.primary,
			light: lighten(options.theme.light.primary, 0.3)
		},
		secondary: {
			main: options.theme.light.secondary,
			light: (options.theme.light.secondary, 0.3),
		},
		hover: options.theme.light.hover,
		header: options.theme.light.headerColor,
		sidebar: options.theme.light.sidebarColor,
		error: {
			main: colors.red[400]
		}
	}
});

export default theme
