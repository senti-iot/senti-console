import { createMuiTheme } from '@material-ui/core/styles'
import { primaryColor, secondaryColor, hoverColor } from 'assets/jss/material-dashboard-react'
import { teal, red } from '@material-ui/core/colors'

const theme = createMuiTheme({
	typography: {
		useNextVariants: true,
		suppressDeprecationWarnings: true,
	},
	overrides: {
		MuiMenuItem: {
			root: {
				"&$selected": {
					backgroundColor: `${teal[500]} !important`,
					color: "#fff"
				}
			},
		},
		MuiCard: {
			root: {
				width: '100%',
				overflow: "visible"
			}
		},
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
			underline: {
				'&:hover:not($disabled):not($focused):not($error):before': {
					borderBottom: '2px solid #4db6ac',
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
			main: primaryColor
		},
		secondary: {
			main: secondaryColor,
			light: hoverColor,
		},
		error: {
			main: red[400]
		}
	},
});
export default theme