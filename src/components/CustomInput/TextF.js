
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles, TextField } from '@material-ui/core';

const styles = theme => ({
	leftIcon: {
		marginRight: theme.spacing.unit
	}
})
/**
* @augments {Component<{	id:string.isRequired,	label:string.isRequired,	value:string.isRequired,	handleChange:Function.isRequired,	handleClick:Function,	autoFocus:boolean,	noFullWidth:boolean,	multiline:boolean,	rows:number,	error:boolean,	type:string,	disabled:boolean,	helperText:string,	InputProps:object,>}
*/
const TextF = (props) => {

	return (
		<TextField
			autoFocus={props.autoFocus ? props.autoFocus : undefined}
			id={props.id}
			label={props.label}
			value={props.value}
			onClick={props.handleClick}
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
	value: PropTypes.string.isRequired,
	handleChange: PropTypes.func.isRequired,
	handleClick: PropTypes.func,
	autoFocus: PropTypes.bool,
	noFullWidth: PropTypes.bool,
	multiline: PropTypes.bool,
	rows: PropTypes.number,
	error: PropTypes.bool,
	type: PropTypes.string,
	disabled: PropTypes.bool,
	helperText: PropTypes.string,
	InputProps: PropTypes.object,
}
export default withStyles(styles)(TextF)
