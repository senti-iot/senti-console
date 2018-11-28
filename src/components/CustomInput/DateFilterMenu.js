import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Divider, MenuItem, Menu, IconButton } from '@material-ui/core';
import { ItemGrid, Caption, Info, CustomDateTime, ItemG } from 'components';
import { dateTimeFormatter } from 'variables/functions';
import moment from 'moment'
import { DateRange } from 'variables/icons';

/**
* @augments {Component<{	classes:object,	to:instanceOf(Date),	from:instanceOf(Date),	t:Function,	dateFilterInputID:number,	handleDateFilter:Function,>}
*/
class DateFilterMenu extends Component {
	constructor(props) {
		super(props)

		this.state = {
			timeType: props.timeType !== undefined ?  props.timeType : 2,
		}
	}
	timeTypes = [
		{ id: 0, format: 'lll', chart: 'minute' },
		{ id: 1, format: 'lll', chart: 'hour' },
		{ id: 2, format: 'll', chart: 'day' },
		{ id: 3, format: 'll', chart: 'day' },
	]
	options = [
		{ id: 0, label: this.props.t('filters.dateOptions.today') },
		{ id: 1, label: this.props.t('filters.dateOptions.yesterday') },
		{ id: 2, label: this.props.t('filters.dateOptions.thisWeek') },
		{ id: 3, label: this.props.t('filters.dateOptions.7days') },
		{ id: 4, label: this.props.t('filters.dateOptions.30days') },
		{ id: 5, label: this.props.t('filters.dateOptions.90days') },
		{ id: 6, label: this.props.t('filters.dateOptions.custom') },
	]
	handleSetDate = (id) => {

		let to = null
		let from = null
		switch (id) {
			case 0: // Today
				from = moment().startOf('day')
				to = moment().endOf('day')
				break;
			case 1: // Yesterday
				from = moment().subtract(1, 'd').startOf('day')
				to = moment().subtract(1, 'd').endOf('day')
				break;
			case 2: // This week
				from = moment().startOf('week').startOf('day')
				to = moment().endOf('day')
				break;
			case 3: // Last 7 days
				from = moment().subtract(7, 'd').startOf('day')
				to = moment().endOf('day')
				break;
			case 4: // last 30 days
				from = moment().subtract(30, 'd').startOf('day')
				to = moment().endOf('day')
				break;
			case 5: // last 90 days
				from = moment().subtract(90, 'd').startOf('day')
				to = moment().endOf('day')
				break;
			case 6:
				from = this.props.from
				to = this.props.to
				break;
			default:
				break;
		}
		this.props.handleSetDate(id, to, from, this.state.timeType)
	}
	handleCustomDate = date => e => {
		this.props.handleCustomDate(date)(e)
	}

	handleCloseDialog = () => {
		this.setState({ openCustomDate: false, actionAnchor: null })
		this.handleSetDate(6)
	}
	handleDateFilter = (event) => {
		let id = event.target.value
		if (id !== 6) {
			this.handleSetDate(id)
			this.setState({ actionAnchor: null })
		}
		else {
			this.setState({ openCustomDate: true })
		}
	}

	handleCustomCheckBox = (e) => {
		this.setState({ timeType: parseInt(e.target.value, 10) })
	}

	handleCancelCustomDate = () => {
		this.setState({
			loading: false, openCustomDate: false
		})
	}
	renderCustomDateDialog = () => {
		const { classes, to, from, t } = this.props
		const { openCustomDate, timeType } = this.state
		return openCustomDate ? <CustomDateTime
			openCustomDate={openCustomDate}
			handleCloseDialog={this.handleCloseDialog}//
			handleCustomDate={this.handleCustomDate}
			to={to}
			from={from}
			timeType={timeType}
			handleCustomCheckBox={this.handleCustomCheckBox}//
			handleCancelCustomDate={this.handleCancelCustomDate}//
			t={t}
			classes={classes}
		/> : null
	}
	handleOpenMenu = e => {
		this.setState({ actionAnchor: e.currentTarget })
	}
	handleCloseMenu= e => {
		this.setState({ actionAnchor: null })
	}
	onChange = (e) => {

	}
	render() {
		// const { dateFilterInputID } = this.state
		const { to, from, t, dateOption } = this.props
		const { actionAnchor } = this.state
		let displayTo = dateTimeFormatter(to)
		let displayFrom = dateTimeFormatter(from)
		return (
			<Fragment>
				<IconButton				
					aria-label='More'
					aria-owns={actionAnchor ? 'long-menu' : null}
					aria-haspopup='true'
					onClick={this.handleOpenMenu}>
					<DateRange style={{ color: '#fff' }} />
				</IconButton>
				<Menu
					disableAutoFocus
					disableRestoreFocus
					id='long-menu'
					anchorEl={actionAnchor}
					open={Boolean(actionAnchor)}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
					onClose={this.handleCloseMenu}
					getContentAnchorEl={null}
					PaperProps={{
						style: {
							minWidth: 250
						}
					}}>
					<ItemG container direction={'column'}>
						<ItemGrid>
							<Caption>{this.options[this.options.findIndex(d => d.id === dateOption ? true : false)].label}</Caption>
							<Info>{`${displayFrom} - ${displayTo}`}</Info>
						</ItemGrid>
						<Divider />
						<MenuItem onClick={this.handleDateFilter} value={0}>{t('filters.dateOptions.today')}</MenuItem>
						<MenuItem onClick={this.handleDateFilter} value={1}>{t('filters.dateOptions.yesterday')}</MenuItem>
						<MenuItem onClick={this.handleDateFilter} value={2}>{t('filters.dateOptions.thisWeek')}</MenuItem>
						<MenuItem onClick={this.handleDateFilter} value={3}>{t('filters.dateOptions.7days')}</MenuItem>
						<MenuItem onClick={this.handleDateFilter} value={4}>{t('filters.dateOptions.30days')}</MenuItem>
						<MenuItem onClick={this.handleDateFilter} value={5}>{t('filters.dateOptions.90days')}</MenuItem>
			
						<Divider />
						<MenuItem onClick={this.handleDateFilter} value={6}>{t('filters.dateOptions.custom')}</MenuItem>
					</ItemG>
					{this.renderCustomDateDialog()}
				</Menu>
			</Fragment>
		)
	}
}
DateFilterMenu.propTypes = {
	classes: PropTypes.object,
	to: PropTypes.instanceOf(moment),
	from: PropTypes.instanceOf(moment),
	t: PropTypes.func,
	dateFilterInputID: PropTypes.number,
	handleDateFilter: PropTypes.func,
}
export default DateFilterMenu
