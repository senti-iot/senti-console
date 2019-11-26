import { grey } from '@material-ui/core/colors';
import * as colors from '@material-ui/core/colors'

const override = color => ({
	overrides: {
		MuiTooltip: {
			tooltipPlacementRight: {
				background: grey[700],
				fontSize: '12px',
			},
			tooltipPlacementBottom: {
				background: grey[700],
				fontSize: '12px',
			},
			popper: {
				opacity: 1,
			}
		},
		MuiDialogContent: {
			root: { padding: 24 }
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
			}
		},
		MuiListItem: {
			button: {
				transition: 'all 150ms cubic- bezier(0.4, 0, 0.2, 1) 0ms'
			}
		},
		MuiMenuItem: {
			root: {
				"&$selected": {
					backgroundColor: `${colors[color][500]} !important`,
					color: "#fff"
				}
			},
		},
		MuiCard: {
			root: {
				overflow: "visible"
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
					color: colors[color][500],
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
					borderBottom: `2px solid ${colors[color][400]}'` /* + primaryColor */,
				},
				'&:after': {
					borderBottomColor: colors[color][500],
				},
			}
		},
		MuiInputLabel: {
			outlined: {
				transform: 'translate(14px, 14px) scale(1)'
			},
		},
		MuiOutlinedInput: {
			input: {
				padding: '12px 14px'
			},
		},

	}
})
export default override