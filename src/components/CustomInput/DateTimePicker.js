import React from 'react'
import { KeyboardArrowRight, KeyboardArrowLeft, DateRange, AccessTime } from 'variables/icons';
import { DateTimePicker as MuiDateTimePicker } from '@material-ui/pickers';

const DateTimePicker = ({ className, value, label, onChange }) => (
	<MuiDateTimePicker
		autoOk
		ampm={false}
		style={{ maxWidth: 230 }}
		margin={'normal'}
		variant={'outlined'}
		label={label}
		clearable
		mask={[
			/\d/,
			/\d/,
			"/",
			/\d/,
			/\d/,
			"/",
			/\d/,
			/\d/,
			/\d/,
			/\d/,
			" ",
			/\d/,
			/\d/,
			":",
			/\d/,
			/\d/,
		]}
		format={"MM/DD/YYYY HH:mm"}
		placeholder="MM/DD/YYYY HH:mm"
		value={value}
		keyboard
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
