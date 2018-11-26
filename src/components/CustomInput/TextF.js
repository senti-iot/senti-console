
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles, TextField } from '@material-ui/core';
import { compose } from 'recompose';

const styles = theme => ({
	leftIcon: {
		marginRight: theme.spacing.unit
	}
})

/**
* @augments {Component<{	id:string.isRequired,	label:string.isRequired,	value:string.isRequired,	handleChange:Function.isRequired,	handleClick:Function,	autoFocus:boolean,	:boolean,	multiline:boolean,	rows:number,	error:boolean,	type:string,	disabled:boolean,	helperText:string,	InputProps:object,>}
*/
const TextF = (props) => {
	let mobile = window.innerWidth <= props.theme.breakpoints.values.md ? true : false
	return (		
		<TextField
			autoFocus={props.autoFocus ? props.autoFocus : undefined}
			placeholder={props.placeholder ? props.placeholder : undefined}
			id={props.id}
			label={props.label}
			value={props.value}
			onClick={props.handleClick}
			onChange={props.handleChange}
			fullWidth={props.fullWidth || mobile ? true : false}
			multiline={props.multiline ? props.multiline : undefined}
			rows={props.rows ? props.rows : undefined}
			className={props.classes.textField ? props.classes.textFields : ''}
			error={props.error ? props.error : undefined}
			type={props.type ? props.type : undefined}
			pattern={props.pattern ? props.pattern : ''}
			disabled={props.disabled ? props.disabled : false}
			margin='normal'
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
	fullWidth: PropTypes.bool,
	multiline: PropTypes.bool,
	rows: PropTypes.number,
	error: PropTypes.bool,
	type: PropTypes.string,
	disabled: PropTypes.bool,
	helperText: PropTypes.string,
	InputProps: PropTypes.object,
}
export default compose(withStyles(styles, { withTheme: true }))(TextF)