import { createMuiTheme } from '@material-ui/core/styles'
import { primaryColor, secondaryColor, hoverColor } from 'assets/jss/material-dashboard-react'
import { teal, red } from '@material-ui/core/colors'

const theme = createMuiTheme({
	typography: {
		useNextVariants: true,
		suppressDeprecationWarnings: true,
	},
	overrides: {
		MuiButton: {
			text: {
				textTransform: 'uppercase'
			}
		},
		MuiTypography: {
			body1: {
				fontSize: '0.875rem',
			}
		},
		MuiFormControl: {
			root: {
				minWidth: 230,
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
					borderBottom: '2px solid #4db6ac' /* + primaryColor */,
				},
				'&:after': {
					borderBottomColor: teal[500],
				},
			}


		}
	},
	palette: {
		type: 'dark',
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
export default theme