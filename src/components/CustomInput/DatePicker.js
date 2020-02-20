import React from 'react'
import { KeyboardArrowRight, KeyboardArrowLeft } from 'variables/icons';
import { KeyboardDatePicker as MuiDatePicker } from '@material-ui/pickers';

const DatePicker = ({ className, value, label, onChange, disableFuture, error }) => (
	<MuiDatePicker
		style={{ maxWidth: 230 }}
		autoOk
		margin={'normal'}
		variant={'outlined'}
		label={label}
		inputVariant={'outlined'}
		clearable
		// format={'ll'}
		error={error}
		mask={'__/__/____'}
		format={"DD/MM/YYYY"}
		placeholder="DD/MM/YYYY"
		value={value}
		className={className}
		onChange={onChange}
		animateYearScrolling={false}
		color='primary'
		disableFuture={disableFuture}
		rightArrowIcon={<KeyboardArrowRight />}
		leftArrowIcon={<KeyboardArrowLeft />}
	/>
)

export default DatePicker
