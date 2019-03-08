import { createMuiTheme } from '@material-ui/core/styles'
import { primaryColor, secondaryColor, hoverColor, /* headerColor */ } from 'assets/jss/material-dashboard-react'
import { teal, red } from '@material-ui/core/colors'

const theme = createMuiTheme({
	typography: {
		useNextVariants: true,
		suppressDeprecationWarnings: true,
	},
	overrides: {
		MuiDialogContent: {
			root: { padding: 24, color: '#fff' }
		},
		MuiDialogTitle: {
			root: {
				fontSize: "1.25rem",
				fontFamily: "Roboto, Helvetica, Arial",
				fontWeight: 500,
				lineHeight: 1.6,
				letterSpacing: "0.0075em",
				backgroundColor: '#434351',
				color: 'white',
				padding: 16
			},

		},
		MuiListItem: {
			button: {
				transition: 'all 150ms cubic- bezier(0.4, 0, 0.2, 1) 0ms'
			}
		},
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