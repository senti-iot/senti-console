import React from 'react'
import { KeyboardArrowRight, KeyboardArrowLeft, DateRange, AccessTime } from 'variables/icons';
import { KeyboardDateTimePicker as MuiDateTimePicker } from '@material-ui/pickers';

const DateTimePicker = ({ className, value, label, onChange }) => (
	<MuiDateTimePicker
		autoOk
		ampm={false}
		style={{ maxWidth: 240 }}
		margin={'normal'}
		label={label}
		clearable
		inputVariant={'outlined'}
		mask={'__/__/____ __:__:__'}
		format={"DD/MM/YYYY HH:mm:ss"}
		placeholder="MM/DD/YYYY HH:mm:ss"
		value={value}
		className={className}
		onChange={onChange}
		animateYearScrolling={false}
		color='primary'
		disableFuture
		dateRangeIcon={<DateRange />}
		timeIcon={<AccessTime />}
		rightArrowIcon={<KeyboardArrowRight />}
		leftArrowIcon={<KeyboardArrowLeft />}
	/>
)

export default DateTimePicker
