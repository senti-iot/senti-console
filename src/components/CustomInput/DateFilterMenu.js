import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { Divider, MenuItem, Menu, IconButton, makeStyles, Button, Tooltip } from '@material-ui/core';
import { ItemGrid, Info, CustomDateTime, ItemG, DSelect } from 'components';
import { dateTimeFormatter } from 'variables/functions';
import moment from 'moment'
import { DateRange } from 'variables/icons';
import teal from '@material-ui/core/colors/teal'
import { useDispatch } from 'react-redux'
import { changeDate, changeHeatMapDate } from 'redux/dateTime';
import { changeSettingsDate } from 'redux/settings';
import { compose } from 'recompose';
import { useLocalization } from 'hooks'

const styles = makeStyles(theme => ({
	selected: {
		backgroundColor: `${teal[500]} !important`,
		color: "#fff"
	},
}))

/**
* @augments {Component<{	classes:object,	to:instanceOf(Date),	from:instanceOf(Date),	t:Function,	dateFilterInputID:number,	handleDateFilter:Function,>}
*/

// const mapStateToProps = (state) => ({
// })

// const mapDispatchToProps = (dispatch) => ({
// 	handleSetDate: (id, to, from, timeType, pId) => dispatch(changeDate(id, to, from, timeType, pId)),
// 	handleSetSettingsPeriod: (id, to, from, timeType, pId) => dispatch(changeSettingsDate(id, to, from, timeType, pId)),
// 	handleSetHeatmapDate: (id, to, from, timeType) => dispatch(changeHeatMapDate(id, to, from, timeType))
// })

// @Andrei
// TODO: line 151
const DateFilterMenu = props => {
	const classes = styles()
	const t = useLocalization()
	const dispatch = useDispatch()
	const [/* timeType */, setTimeType] = useState(props.period !== undefined ? props.period.timeType : 2)
	const [openCustomDate, setOpenCustomDate] = useState(null) // added
	const [actionAnchor, setActionAnchor] = useState(null) // added
	const [/* loading */, setLoading] = useState(true) // added
	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		timeType: props.period !== undefined ? props.period.timeType : 2,
	// 	}
	// }
	// let timeTypes = [
	// 	{ id: 0, format: 'lll', chart: 'minute' },
	// 	{ id: 1, format: 'lll', chart: 'hour' },
	// 	{ id: 2, format: 'll', chart: 'day' },
	// 	{ id: 3, format: 'll', chart: 'day' },
	// ]
	let dOptions = [
		{ value: 0, label: t('filters.dateOptions.today') },
		{ value: 1, label: t('filters.dateOptions.yesterday') },
		{ value: 2, label: t('filters.dateOptions.thisWeek') },
		{ value: 3, label: t('filters.dateOptions.7days') },
		{ value: 4, label: t('filters.dateOptions.30days') },
		{ value: 5, label: t('filters.dateOptions.90days') },
		{ value: 6, label: t('filters.dateOptions.custom') },
	]
	let options = [
		{ id: 0, label: t('filters.dateOptions.today') },
		{ id: 1, label: t('filters.dateOptions.yesterday') },
		{ id: 2, label: t('filters.dateOptions.thisWeek') },
		{ id: 3, label: t('filters.dateOptions.7days') },
		{ id: 4, label: t('filters.dateOptions.30days') },
		{ id: 5, label: t('filters.dateOptions.90days') },
		{ id: 6, label: t('filters.dateOptions.custom') },
	]
	const handleSetDate = (menuId, to, from, timeType) => {
		const { period } = props
		let defaultT = 0
		switch (menuId) {
			case 0: // Today
				from = moment().startOf('day')
				to = moment()
				defaultT = 1
				break;
			case 1: // Yesterday
				from = moment().subtract(1, 'd').startOf('day')
				to = moment().subtract(1, 'd').endOf('day')
				defaultT = 1
				break;
			case 2: // This week
				from = moment().startOf('week').startOf('day')
				to = moment()
				defaultT = 2
				break;
			case 3: // Last 7 days
				from = moment().subtract(7, 'd').startOf('day')
				to = moment()
				defaultT = 2
				break;
			case 4: // last 30 days
				from = moment().subtract(30, 'd').startOf('day')
				to = moment()
				defaultT = 2
				break;
			case 5: // last 90 days
				from = moment().subtract(90, 'd').startOf('day')
				to = moment()
				defaultT = 2
				break;
			case 6:
				from = moment(from)
				to = moment(to)
				defaultT = timeType
				break;
			default:
				break;
		}
		if (props.settings) {
			if (menuId === 6)
				return dispatch(changeSettingsDate(menuId, to, from, defaultT, period ? period.id : -1))
			// return this.props.handleSetSettingsPeriod(menuId, to, from, defaultT, period ? period.id : -1)
			return dispatch(changeSettingsDate(menuId, undefined, undefined, defaultT, period ? period.id : -1))
			// return this.props.handleSetSettingsPeriod(menuId, undefined, undefined, defaultT, period ? period.id : -1)
		}
		if (props.heatmap) {
			return dispatch(changeHeatMapDate(menuId, to, from, defaultT))
			// return this.props.handleSetHeatmapDate(menuId, to, from, defaultT)
		}
		if (props.customSetDate) {
			return props.customSetDate(menuId, to, from, defaultT)
		}
		dispatch(changeDate(menuId, to, from, defaultT, period ? period.id : -1))
		// this.props.handleSetDate(menuId, to, from, defaultT, period ? period.id : -1)

	}

	const handleCloseDialog = (to, from, timeType) => {
		// const { period } = this.props
		setOpenCustomDate(false)
		setActionAnchor(null)
		// this.setState({ openCustomDate: false, actionAnchor: null })
		handleSetDate(6, to, from, timeType)
	}
	/**
	 * Menu Handling, close the menu and set the date or open Custom Date
	 */
	const handleDateFilter = (event) => {
		let id = event.target.value
		if (id !== 6) {
			setActionAnchor(null)
			// TODO - refactor setState callback
			// this.setState({ actionAnchor: null }, () => this.handleSetDate(id))
		}
		else {
			setOpenCustomDate(true)
			// this.setState({ openCustomDate: true })
		}
	}

	const handleCustomCheckBox = (e) => {
		setTimeType(parseInt(e.target.value, 10))
		// this.setState({ timeType: parseInt(e.target.value, 10) })
	}

	const handleCancelCustomDate = () => {
		setLoading(false)
		setOpenCustomDate(false)
		// this.setState({
		// 	loading: false, openCustomDate: false
		// })
	}
	const renderCustomDateDialog = () => {
		const { period } = props
		// const { openCustomDate } = this.state
		return openCustomDate ? <CustomDateTime
			openCustomDate={openCustomDate}
			handleCloseDialog={handleCloseDialog}//
			to={period ? period.to : undefined}
			from={period ? period.from : undefined}
			timeType={period ? period.timeType : undefined}
			handleCustomCheckBox={handleCustomCheckBox}//
			handleCancelCustomDate={handleCancelCustomDate}//
			t={t}
		/> : null
	}
	const handleOpenMenu = e => {
		setActionAnchor(e.currentTarget)
		// this.setState({ actionAnchor: e.currentTarget })
	}
	const handleCloseMenu = e => {
		setActionAnchor(null)
		// this.setState({ actionAnchor: null })
	}

	const isSelectedFunc = (value) => value === props.period ? props.period.menuId ? true : false : false

	const { label, period, icon, button, settings, inputType, buttonProps } = props
	// const { actionAnchor } = this.state
	let displayTo = period ? dateTimeFormatter(period.to) : ""
	let displayFrom = period ? dateTimeFormatter(period.from) : ""
	return (
		inputType ? <DSelect
			onChange={handleDateFilter}
			label={label}
			value={period.menuId}
			menuItems={dOptions}
		/> :
			<Fragment>
				{button && <Button

					aria-label='More'
					aria-owns={actionAnchor ? 'long-menu' : null}
					aria-haspopup='true'
					style={{ color: 'rgba(0, 0, 0, 0.54)' }}
					onClick={handleOpenMenu}
					{...buttonProps}
				>
					{icon ? icon : <DateRange />}
				</Button>}
				{!button && <Tooltip title={t('tooltips.chart.period')}>
					<IconButton
						aria-label='More'
						aria-owns={actionAnchor ? 'long-menu' : null}
						aria-haspopup='true'
						onClick={handleOpenMenu}>
						{icon ? icon : <DateRange />}
					</IconButton>
				</Tooltip>}
				<Menu
					disableAutoFocus
					disableRestoreFocus
					id='long-menu'
					anchorEl={actionAnchor}
					open={Boolean(actionAnchor)}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
					onClose={handleCloseMenu}
					getContentAnchorEl={null}
					PaperProps={{
						style: {
							minWidth: 250
						}
					}}>
					<ItemG container direction={'column'}>
						{!settings && period && <Fragment>
							<ItemGrid>
								<Info>{options[options.findIndex(d => d.id === period.menuId ? true : false)].label}</Info>
								<Info>{`${displayFrom} - ${displayTo}`}</Info>
							</ItemGrid>
							<Divider />
						</Fragment>}
						<MenuItem selected={isSelectedFunc(0)} classes={{ selected: classes.selected }} onClick={handleDateFilter} value={0}>{t('filters.dateOptions.today')}</MenuItem>
						<MenuItem selected={isSelectedFunc(1)} classes={{ selected: classes.selected }} onClick={handleDateFilter} value={1}>{t('filters.dateOptions.yesterday')}</MenuItem>
						<MenuItem selected={isSelectedFunc(2)} classes={{ selected: classes.selected }} onClick={handleDateFilter} value={2}>{t('filters.dateOptions.thisWeek')}</MenuItem>
						<MenuItem selected={isSelectedFunc(3)} classes={{ selected: classes.selected }} onClick={handleDateFilter} value={3}>{t('filters.dateOptions.7days')}</MenuItem>
						<MenuItem selected={isSelectedFunc(4)} classes={{ selected: classes.selected }} onClick={handleDateFilter} value={4}>{t('filters.dateOptions.30days')}</MenuItem>
						<MenuItem selected={isSelectedFunc(5)} classes={{ selected: classes.selected }} onClick={handleDateFilter} value={5}>{t('filters.dateOptions.90days')}</MenuItem>

						<Divider />
						<MenuItem selected={isSelectedFunc(6)} classes={{ selected: classes.selected }} onClick={handleDateFilter} value={6}>{t('filters.dateOptions.custom')}</MenuItem>
					</ItemG>
					{renderCustomDateDialog()}
				</Menu>
			</Fragment>
	)
}
DateFilterMenu.propTypes = {
	classes: PropTypes.object,
	to: PropTypes.instanceOf(moment),
	from: PropTypes.instanceOf(moment),
	t: PropTypes.func,
	dateFilterInputID: PropTypes.number,
	handleDateFilter: PropTypes.func,
}

// let DFMenu = compose(connect(mapStateToProps, mapDispatchToProps, undefined, { forwardRef: true }), withStyles(styles))(DateFilterMenu)
let DFMenu = compose(DateFilterMenu)
// export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DateFilterMenu))
const DFMenuRef = React.forwardRef((props, ref) => <DFMenu {...props} ref={ref} />)
export default DFMenuRef