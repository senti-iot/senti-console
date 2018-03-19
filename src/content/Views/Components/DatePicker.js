/* eslint-disable react/no-unused-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import momentPropTypes from 'react-moment-proptypes'
import { forbidExtraProps } from 'airbnb-prop-types'
import moment from 'moment'
import omit from 'lodash/omit'
import { SearchContainer } from '../ViewStyles'
import { DayPickerRangeController } from 'react-dates'

// import { ScrollableOrientationShape } from 'react-dates'

import { START_DATE, END_DATE, HORIZONTAL_ORIENTATION } from 'react-dates/src/constants'
// import isInclusivelyAfterDay from 'react-dates/src/utils/isInclusivelyAfterDay'

const propTypes = forbidExtraProps({
	// example props for the demo
	autoFocusEndDate: PropTypes.bool,
	initialStartDate: momentPropTypes.momentObj,
	initialEndDate: momentPropTypes.momentObj,
	startDateOffset: PropTypes.func,
	endDateOffset: PropTypes.func,
	showInputs: PropTypes.bool,

	keepOpenOnDateSelect: PropTypes.bool,
	minimumNights: PropTypes.number,
	isOutsideRange: PropTypes.func,
	isDayBlocked: PropTypes.func,
	isDayHighlighted: PropTypes.func,

	// DayPicker props
	enableOutsideDays: PropTypes.bool,
	numberOfMonths: PropTypes.number,
	orientation: PropTypes.oneOf(['horizontal', 'vertical', 'verticalScrollable']),
	withPortal: PropTypes.bool,
	initialVisibleMonth: PropTypes.func,
	renderCalendarInfo: PropTypes.func,

	navPrev: PropTypes.node,
	navNext: PropTypes.node,

	onPrevMonthClick: PropTypes.func,
	onNextMonthClick: PropTypes.func,
	onOutsideClick: PropTypes.func,
	renderCalendarDay: PropTypes.func,
	renderDayContents: PropTypes.func,

	// i18n
	monthFormat: PropTypes.string,

	isRTL: PropTypes.bool,
})

const defaultProps = {
	// example props for the demo
	autoFocusEndDate: false,
	initialStartDate: moment('1/1/2010'),
	initialEndDate: moment(),
	startDateOffset: undefined,
	endDateOffset: undefined,
	showInputs: true,

	// day presentation and interaction related props
	renderCalendarDay: undefined,
	renderDayContents: null,
	minimumNights: 1,
	// isDayBlocked: () => false,
	// isOutsideRange: day => !isInclusivelyAfterDay(day, moment()),
	// isDayHighlighted: () => false,
	// enableOutsideDays: false,

	// calendar presentation and interaction related props
	orientation: HORIZONTAL_ORIENTATION,
	withPortal: false,
	initialVisibleMonth: null,
	numberOfMonths: 2,
	onOutsideClick() { },
	keepOpenOnDateSelect: false,
	renderCalendarInfo: null,
	isRTL: false,

	// navigation related props
	navPrev: null,
	navNext: null,
	onPrevMonthClick() { },
	onNextMonthClick() { },

	// internationalization
	monthFormat: 'MMMM YYYY',
}
/**
 * 
 * 
 * @class DayPickerRangeControllerWrapper
 * @extends {React.Component}
 * @description Hello World
 */
class DayPickerRangeControllerWrapper extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			focusedInput: props.autoFocusEndDate ? END_DATE : START_DATE,
			startDate: props.initialStartDate,
			endDate: props.initialEndDate,
			openDatePicker: false
		}

		this.onDatesChange = this.onDatesChange.bind(this)
		this.onFocusChange = this.onFocusChange.bind(this)
	}

	onDatesChange({ startDate, endDate }) {
		this.setState({ startDate, endDate })
	}

	onFocusChange(focusedInput) {
		this.setState({
			// Force the focusedInput to always be truthy so that dates are always selectable
			focusedInput: !focusedInput ? START_DATE : focusedInput,
		})
	}

	// onOpenDatePicker = () => {
	// 	this.setState({
	// 		openDatePicker: !this.state.openDatePicker
	// 	})
	// }
	handleDatePickerOpen = (openDatePicker) => e => {
		e.preventDefault()
		this.setState({
			openDatePicker: openDatePicker
		})
	}
	render() {
		const { showInputs } = this.props
		const { focusedInput, startDate, endDate, openDatePicker } = this.state

		const props = omit(this.props, [
			'autoFocus',
			'autoFocusEndDate',
			'initialStartDate',
			'initialEndDate',
			'showInputs'
		])

		const startDateString = startDate && startDate.format('DD.MM.YYYY')
		const endDateString = endDate && endDate.format('DD.MM.YYYY')

		return (
			<div style={{ display: 'flex', position: 'relative', flexFlow: 'column nowrap' }}>
				{showInputs &&
					<SearchContainer style={{ padding: '0px 10px' }} onClick={this.handleDatePickerOpen(true)}>
						{startDateString}
						&nbsp;{'-'}{'\u00A0'}
						{endDateString}
					</SearchContainer>
				}

				{openDatePicker && <div style={{ position: 'absolute', zIndex: 5, marginTop: 40 }}>
					<DayPickerRangeController
						{...props}
						onDatesChange={this.onDatesChange}
						onFocusChange={this.onFocusChange}
						focusedInput={focusedInput}
						startDate={startDate}
						endDate={endDate}
						onOutsideClick={this.handleDatePickerOpen(false)} //TODO
					/></div>}
			</div>
		)
	}
}

DayPickerRangeControllerWrapper.propTypes = propTypes
DayPickerRangeControllerWrapper.defaultProps = defaultProps

export default DayPickerRangeControllerWrapper