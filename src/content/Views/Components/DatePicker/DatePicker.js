/* eslint-disable react/no-unused-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import momentPropTypes from 'react-moment-proptypes'
import { forbidExtraProps } from 'airbnb-prop-types'
import moment from 'moment'
import omit from 'lodash/omit'
import { DatePickerInput, Input } from '../../ViewStyles'
import { DayPickerRangeController } from 'react-dates'
import { Icon } from 'odeum-ui'
import { withTheme } from 'styled-components'
// import { ScrollableOrientationShape } from 'react-dates'

import { START_DATE, END_DATE, HORIZONTAL_ORIENTATION } from 'react-dates/src/constants'
// import isInclusivelyAfterDay from 'react-dates/src/utils/isInclusivelyAfterDay'
import ThemedStyleSheet from 'react-with-styles/lib/ThemedStyleSheet'
import aphroditeInterface from 'react-with-styles-interface-aphrodite'
// import DefaultTheme from 'react-dates/lib/theme/DefaultTheme'
import { getTheme } from './DatePickerTheme'

// ThemedStyleSheet.registerInterface(aphroditeInterface)


const propTypes = forbidExtraProps({
	activeFilter: PropTypes.bool,
	startDate: momentPropTypes.momentObj,
	endDate: momentPropTypes.momentObj,
	handleDateFilter: PropTypes.func,
	handleDisableDateFilter: PropTypes.func,
	theme: PropTypes.object,
	style: PropTypes.object,
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
			startDate: '',
			endDate: '',
			openDatePicker: false,
			error: false,
			inputValue: props.startDate ? props.startDate.format('DD.MM.YYYY') + ' - ' + props.endDate.format('DD.MM.YYYY') : ''
		}
	}
	componentWillMount = () => {

		ThemedStyleSheet.registerInterface(aphroditeInterface)
		// ThemedStyleSheet.registerTheme({
		// 	reactDates: {
		// 		...DefaultTheme.reactDates,
		// 		color: {
		// 			...DefaultTheme.reactDates.color,
		// 			core: {
					
		// 				primary: this.props.theme.tab.selected,
		// 				primaryShade_2: this.props.theme.tab.selected,
		// 				secondary: this.props.theme.header.background,
		// 				...DefaultTheme.reactDates.core
		// 			},
		// 		},
		// 	},
		// })
		ThemedStyleSheet.registerTheme(getTheme(this.props.theme))
	}

	componentWillUpdate = (nextProps, nextState) => {
		if (nextProps.startDate !== this.props.startDate && nextProps.endDate !== this.props.endDate && nextProps.endDate !== null)
			this.setState({
				inputValue: nextProps.startDate.format('DD.MM.YYYY') + ' - ' + nextProps.endDate.format('DD.MM.YYYY')
			})
	}

	onDatesChange = ({ startDate, endDate }) => {
		this.props.handleDateFilter(startDate, endDate)
		if (startDate && endDate)
			this.setState({ inputValue: startDate.format('DD.MM.YYYY') + ' - ' + endDate.format('DD.MM.YYYY'), error: false })
	}

	onFocusChange = (focusedInput) => {

		this.setState({
			focusedInput: !focusedInput ? START_DATE : focusedInput,
		})
	}

	handleDatePickerOpen = (openDatePicker) => e => {
		e.stopPropagation()
		e.preventDefault()
		this.setState({
			openDatePicker: openDatePicker
		})
	}

	handleDateInput = e => {
		this.setState({ inputValue: e.target.value })
		var arr = e.target.value.split('-')
		try {
			var startDate = moment(arr[0], 'DD.MM.YYYY')
			var endDate = moment(arr[1], 'DD.MM.YYYY')
			if (!startDate.isValid() || !endDate.isValid())
				throw new DOMException('Invalid Date')
			else {
				this.setState({
					startDate: startDate,
					endDate: endDate,
					error: false
				})
			}
		}
		catch (error) {
			this.setState({ error: true })
		}
	}

	handleDateInputFilter = e => {
		switch (e.key) {
			case 'Enter':
				this.onDatesChange({
					startDate: this.state.startDate,
					endDate: this.state.endDate
				})
				break
			case 'Escape':
				this.props.handleDisableDateFilter()
				this.setState({
					openDatePicker: false,
					inputValue: ''
				})
				break
			default:
				break
		}
	}

	render() {
		const { showInputs } = this.props
		const { focusedInput, openDatePicker } = this.state
		const { startDate, endDate } = this.props

		const props = omit(this.props, [
			'activeFilter',
			'startDate',
			'endDate',
			'handleDisableDateFilter',
			'handleDateFilter',
			'autoFocus',
			'autoFocusEndDate',
			'initialStartDate',
			'initialEndDate',
			'showInputs',
			'theme'
		])

		return (
			<div style={{ display: 'flex', position: 'relative', flexFlow: 'column nowrap' }}>
				{showInputs &&
					<DatePickerInput style={{ ...this.props.style }} onClick={this.handleDatePickerOpen(true)} error={this.state.error} active={openDatePicker || this.props.activeFilter}>
						<div style={{ width: '30%', height: '100%', background: this.state.error ? 'palevioletred' : this.props.theme.tab.selected, display: 'flex', alignItems: 'center', padding: '0px 4px' }}>
							<Icon icon={'date_range'} color={'#fff'} iconSize={20} style={{ margin: 3 }} />
						</div>
						<Input
							value={this.state.inputValue}
							style={{ padding: '0px 4px' }}
							onChange={this.handleDateInput}
							onKeyDown={this.handleDateInputFilter} />
					</DatePickerInput>
				}

				{openDatePicker && <div style={{ position: 'absolute', zIndex: 5, marginTop: 40 }}>
					<DayPickerRangeController
						{...props}
						hideKeyboardShortcutsPanel
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

export default withTheme(DayPickerRangeControllerWrapper)