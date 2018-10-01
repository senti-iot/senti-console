import React from 'react'
import PropTypes from 'prop-types'
import { withStyles, TextField } from '@material-ui/core';

const styles = theme => ({
	leftIcon: {
		marginRight: theme.spacing.unit
	}
})
const TextF = (props) => {

	return (
		<TextField
			autoFocus={props.autoFocus ? props.autoFocus : undefined}
			id={props.id}
			label={props.label}
			value={props.value}
			onChange={props.handleChange}
			fullWidth={props.noFullWidth ? undefined : true}
			multiline={props.multiline ? props.multiline : undefined}
			rows={props.rows ? props.rows : undefined}
			className={props.classes.textField ? props.classes.textFields : ""}
			error={props.error ? props.error : undefined}
			type={props.type ? props.type : undefined}
			pattern={props.pattern ? props.pattern : ""}
			disabled={props.disabled ? props.disabled : false}
			margin="normal"
			helperText={props.helperText}
			InputProps={props.InputProps ? props.InputProps : null}
		/>

	)
}
TextF.propTypes = {
	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	value: PropTypes.string,
	// handleChange: PropTypes.func.isRequired
}
export default withStyles(styles)(TextF)
