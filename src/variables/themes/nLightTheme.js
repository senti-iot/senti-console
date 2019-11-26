import { createMuiTheme, darken } from '@material-ui/core/styles'
import override from './overrides'
import * as colors from '@material-ui/core/colors';
import hexToRgba from 'hex-to-rgba';
import { bgColors } from 'Styles/backgroundColors';


const theme = (options) => createMuiTheme({
	...override(),
	palette: {
		type: "light",
		primary: {
			main: colors.lightBlue[500],
			light: colors.lightBlue[400],
		},
		secondary: {
			main: colors.orange[500],
			light: colors.orange[300],
		},
		error: {
			main: colors.red[400]
		}
	},
	appBackground: bgColors['lightBlue'].background,
	boxBackground: darken(hexToRgba(colors['lightBlue'][700], 0.7), 0.5),
	textColor: '#fff',
	primary: colors.lightBlue[500],
	activeButton: colors.orange[500],
});

export default theme
