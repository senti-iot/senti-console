import React from 'react';
import { withStyles, FormControl, InputLabel, Input } from '@material-ui/core';
import { Clear, Check } from '@material-ui/icons';
import PropTypes from 'prop-types';
import cx from 'classnames';

import customInputStyle from 'assets/jss/material-dashboard-react/customInputStyle';

function CustomInput({ ...props }) {
	const {
		classes,
		formControlProps,
		labelText,
		id,
		labelProps,
		inputProps,
		error,
		success,
		autoFocus,
	} = props;
	const labelClasses = cx({
		[' ' + classes.labelRootError]: error,
		[' ' + classes.labelRootSuccess]: success && !error
	});
	const underlineClasses = cx({
		[classes.underlineError]: error,
		[classes.underlineSuccess]: success && !error,
		[classes.underline]: true
	});
	const marginTop = cx({
		[classes.marginTop]: labelText === undefined
	});
	return (
		<FormControl
			{...formControlProps}
			className={formControlProps.className + ' ' + classes.formControl}
		>
			{labelText !== undefined ? (
				<InputLabel
					className={classes.labelRoot + labelClasses}
					htmlFor={id}
					{...labelProps}
				>
					{labelText}
				</InputLabel>
			) : null}
			<Input
				innerRef={ref => props.inputRef ? props.inputRef(ref) : null}
				autoFocus={autoFocus ? autoFocus : false}
				classes={{
					root: marginTop,
					disabled: classes.disabled,
					underline: underlineClasses,
				}}
				id={id}
				{...inputProps}
			/>
			{error ? (
				<Clear className={classes.feedback + ' ' + classes.labelRootError} />
			) : success ? (
				<Check className={classes.feedback + ' ' + classes.labelRootSuccess} />
			) : null}
		</FormControl>
	);
}

CustomInput.propTypes = {
	classes: PropTypes.object.isRequired,
	labelText: PropTypes.node,
	labelProps: PropTypes.object,
	id: PropTypes.string,
	inputProps: PropTypes.object,
	formControlProps: PropTypes.object,
	error: PropTypes.bool,
	success: PropTypes.bool
};

export default withStyles(customInputStyle)(CustomInput);
