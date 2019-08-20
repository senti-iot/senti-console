
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles, TextField } from '@material-ui/core';
import { compose } from 'recompose';
import cx from 'classnames'
const styles = theme => ({
	leftIcon: {
		marginRight: theme.spacing(1)
	},
	underlineRev: {
		background: '#fff'
	},
	root: {
		"&:hover:not($disabled):not($focused):not($error) $notchedOutline": {
			borderColor: "rgb(39,136,129, 0.67)"
		}
	},
	disabled: {},
	focused: {},
	error: {},
	notchedOutline: {
		borderColor: "rgb(39,136,129, 0.23)",
		"&:hover": {
			borderColor: "rgb(39,136,129, 1)"
		}
	},
	rootReversed: {
		"&:hover:not($disabled):not($focused):not($error) $notchedOutline": {
			borderColor: "rgba(255,255,255, 0.67)"
		}
	},
	disabledReversed: {},
	focusedReversed: {},
	errorReversed: {},
	notchedOutlineReversed: {
		borderColor: 'rgba(255,255,255, 0.23)'
	},
	reversed: {
		color: 'rgba(255, 255, 255, 0.23)',
		"&:hover:not($disabled):not($focused):not($error) $notchedOutline": {
			borderColor: "#fff"
		}
	},
	reversedBorder: {
		borderColor: 'rgba(255, 255, 255, 0.23)',
		"&:hover": {
			borderColor: '#fff !important;'
		}
	}
})

/**
* @augments {Component<{	id:string.isRequired,	label:string.isRequired,	value:string.isRequired,	handleChange:Function.isRequired,	handleClick:Function,	autoFocus:boolean,	:boolean,	multiline:boolean,	rows:number,	error:boolean,	type:string,	disabled:boolean,	helperText:string,	InputProps:object,>}
*/
const TextF = (props) => {
	let mobile = window.innerWidth <= props.theme.breakpoints.values.md ? true : false
	let classNames = cx({
		[props.className]: props.className ? true : false,
		[props.classes.reversed]: props.reversed,
		[props.classes.textField]: props.classes.textField ? true : false
	})
	// let notchedCX = cx({
	// 	[props.classes.reversedBorder]: props.reversed,
	// })
	return (
		<TextField
			style={{ maxWidth: props.fullWidth !== undefined ? undefined : mobile ? undefined : 230, ...props.style }}
			variant={'outlined'}
			autoFocus={props.autoFocus ? props.autoFocus : undefined}
			placeholder={props.placeholder ? props.placeholder : undefined}
			id={props.id}
			label={props.label}
			value={props.value}
			onClick={props.handleClick}
			onChange={props.handleChange}
			fullWidth={props.fullWidth !== undefined ? props.fullWidth : mobile ? true : false}
			// fullWidth={props.fullWidth || mobile ? true : false}
			multiline={props.multiline ? props.multiline : undefined}
			rows={props.rows ? props.rows : undefined}
			className={classNames}
			error={props.error ? props.error : undefined}
			type={props.type ? props.type : undefined}
			pattern={props.pattern ? props.pattern : ''}
			disabled={props.disabled ? props.disabled : false}
			margin={props.margin ? props.margin : 'normal'}
			notched={props.notched}
			helperText={props.helperText}
			InputProps={props.InputProps ? {
				...props.InputProps,
				style: { ...props.InputProps.style, boxSizing: 'border-box' },
				classes: props.InputProps.classes ? props.InputProps.classes : props.reversed ? {
					root: props.classes.rootReversed,
					disabled: props.classes.disabledReversed,
					focused: props.classes.focusedReversed,
					error: props.classes.errorReversed,
					notchedOutline: props.classes.notchedOutlineReversed,
				} :
					{
						root: props.classes.root,
						disabled: props.classes.disabled,
						focused: props.classes.focused,
						error: props.classes.error,
						notchedOutline: props.classes.notchedOutline
					}
			} : null}
			onKeyPress={props.onKeyPress}
			onKeyDown={props.onKeyDown}
		// FormHelperTextProps={{
		// 	className: classNames
		// }}
		// InputLabelProps={{
		// 	className: classNames
		// }}
		/>

	)
}
TextF.propTypes = {
	id: PropTypes.string.isRequired,
	// label: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	handleChange: PropTypes.func,
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