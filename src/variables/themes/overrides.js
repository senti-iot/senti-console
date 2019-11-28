import { grey } from '@material-ui/core/colors';

const override = (color, dark) => ({
	overrides: {
		MuiPaper: {
			root: {
				background: dark ? '#424242' : '#fff'
			}
		},
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
				backgroundColor: `${color}`,
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
					backgroundColor: `${color} !important`,
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
					color: color,
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
					borderBottom: `2px solid ${color}'` /* + primaryColor */,
				},
				'&:after': {
					borderBottomColor: color,
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