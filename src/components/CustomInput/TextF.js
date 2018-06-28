import React from 'react'
import PropTypes from 'prop-types'
import { withStyles, TextField } from '@material-ui/core';
import { teal } from '@material-ui/core/colors'
const styles = theme => ({
	leftIcon: {
		marginRight: theme.spacing.unit
	},
	textField: {
		margin: theme.spacing.unit * 2
	},
	label: {
		'&$focused': {
			color: teal[500],
		},
	},
	focused: {},
	underline: {
		'&:after': {
			borderBottomColor: teal[500],
		},
	}
})
const TextF = (props) => {
	return (
		<TextField
			id={props.id}
			label={props.label}
			value={props.val}
			onChange={props.handleChange}
			fullWidth
			className={props.classes.textField}
			InputLabelProps={
				{
					FormLabelClasses: {
						root: props.classes.label,
						focused: props.classes.focused,
					},
				}
			}
			InputProps={{
				classes: {
					underline: props.classes.underline,
				}
			}}
			margin="normal" />

	)
}
TextF.propTypes = {
	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	handleChange: PropTypes.func.isRequired
}
export default withStyles(styles)(TextF)
