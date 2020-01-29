import React from 'react'
import { KeyboardArrowRight, KeyboardArrowLeft } from 'variables/icons';
import { DatePicker as MuiDatePicker } from 'material-ui-pickers';

const DatePicker = ({ className, value, label, onChange, disableFuture, error }) => (
	<MuiDatePicker
		style={{ maxWidth: 230 }}
		autoOk
		margin={'normal'}
		variant={'outlined'}
		label={label}
		clearable
		mask={value =>
			value ? [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/] : []
		}
		// format={'ll'}
		error={error}
		format={"DD/MM/YYYY"}
		placeholder="DD/MM/YYYY"
		value={value}
		keyboard
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
