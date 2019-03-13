import React, { Component } from 'react'
import { KeyboardArrowRight, KeyboardArrowLeft } from 'variables/icons';
import { DatePicker as MuiDatePicker } from 'material-ui-pickers';

class DatePicker extends Component {
	render() {
		const { className, value, label, onChange, disableFuture, error } = this.props
		return (
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
				errror={error}
				format={ "DD/MM/YYYY"}
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
	}
}

export default DatePicker
