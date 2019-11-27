
import React from 'react'
import PropTypes from 'prop-types'
import { TextField } from '@material-ui/core';
import cx from 'classnames'
import { useTheme } from 'hooks';
import { makeStyles } from '@material-ui/styles';
import hexToRgba from 'hex-to-rgba';

const styles = makeStyles(theme => ({
	leftIcon: {
		// marginRight: theme.spacing(1)
	},
	underlineRev: {
		background: '#fff'
	},
	root: {
		"&:hover:not($disabled):not($focused):not($error) $notchedOutline": {
			borderColor: hexToRgba(theme.palette.primary.main, 0.67)
			// borderColor: "rgb(39,136,129, 0.67)"
		}
	},
	disabled: {},
	focused: {},
	error: {},
	notchedOutline: {
		// borderColor: "rgb(39,136,129, 0.23)",
		borderColor: hexToRgba(theme.palette.primary.main, 0.23),
		"&:hover": {
			borderColor: theme.palette.hover
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
}))


const TextF = (props) => {
	const theme = useTheme()
	let mobile = window.innerWidth <= theme.breakpoints.values.md ? true : false
	const classes = styles()
	let classNames = cx({
		[props.className]: props.className ? true : false,
		[classes.reversed]: props.reversed,
		[classes.textField]: classes.textField ? true : false
	})
	// let notchedCX = cx({
	// 	[classes.reversedBorder]: props.reversed,
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
			onClick={props.onClick}
			onChange={props.onChange}
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
					root: classes.rootReversed,
					disabled: classes.disabledReversed,
					focused: classes.focusedReversed,
					error: classes.errorReversed,
					notchedOutline: classes.notchedOutlineReversed,
				} :
					{
						root: classes.root,
						disabled: classes.disabled,
						focused: classes.focused,
						error: classes.error,
						notchedOutline: classes.notchedOutline
					}
			} : null}
			onKeyPress={props.onKeyPress}
			onKeyDown={props.onKeyDown}
		/>

	)
}
TextF.propTypes = {
	id: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func,
	onClick: PropTypes.func,
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

// export default compose(withStyles(styles, { withTheme: true }))(TextF)

export default TextF