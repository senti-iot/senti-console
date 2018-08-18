import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types'
import {
	Grid, IconButton, Menu, MenuItem, withStyles,
	Select, FormControl, FormHelperText, Divider, Dialog, DialogTitle, DialogContent,
	Button, DialogActions, ListItem, ListItemIcon, ListItemText, Collapse, List, Hidden, Checkbox, FormControlLabel
} from '@material-ui/core';
import {
	AccessTime, AssignmentTurnedIn, MoreVert,
	DateRange, KeyboardArrowRight, KeyboardArrowLeft,
	DonutLargeRounded, PieChartRounded, BarChart, ExpandMore, Visibility
} from "@material-ui/icons"
// import { dateFormatter } from 'variables/functions';
import { InfoCard, ItemGrid, CircularLoader, Caption, Info, /* , Caption, Info */ } from 'components';
import deviceStyles from 'assets/jss/views/deviceStyles';
import { Doughnut, Bar, Pie } from 'react-chartjs-2';
import { getWifiHourly, getWifiDaily } from 'variables/dataDevices';
// import { getRandomColor } from 'variables/colors';
import { teal } from '@material-ui/core/colors'
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import classNames from 'classnames'
var moment = require('moment');



class DeviceData extends Component {
	constructor(props) {
		super(props)

		this.state = {
			from: moment().startOf('day'),
			to: moment().endOf('day'),
			barDataSets: null,
			roundDataSets: null,
			actionAnchor: null,
			loading: true,
			dateFilterInputID: 0,
			timeType: 0,
			openCustomDate: false,
			display: 2,
			visibility: false,
		}
	}

	legendOpts = {
		display: this.props.theme.breakpoints.width("md") < window.innerWidth ? true : false,
		position: 'bottom',
		fullWidth: true,
		reverse: false,
		labels: {
			padding: 10
		}
	}
	barOpts = {
		display: false,
		position: 'bottom',
		fullWidth: true,
		reverse: false,
		labels: {
			padding: 10
		}
	}

	getWifiDay = async () => {
		const { device } = this.props
		const { from, to } = this.state
		let startDate = moment(from).format(this.format)
		let endDate = moment(to).format(this.format)
		let data = await getWifiDaily(device.device_id, startDate, endDate).then(rs => rs)
		if (data) {
			let dataArr = Object.keys(data).map(r => ({ id: r, value: data[r] }))
			this.setState({
				loading: false,
				roundDataSets: {
					labels: dataArr.map(rd => rd.id),
					datasets: [{
						borderColor: "#FFF",
						borderWidth: 1,
						data: dataArr.map(rd => rd.value),
						backgroundColor: teal[500]
					}]
				},
				barDataSets: {
					labels: dataArr.map(rd => rd.id),
					datasets: [{
						borderColor: "#FFF",
						borderWidth: 1,
						data: dataArr.map(rd => rd.value),
						backgroundColor: teal[500]
					}]
				}
			})
		}
		else {
			this.setState({
				loading: false,
				roundDataSets: null,
				barDataSets: null
			})
		}
	}

	getWifiSum = async () => {
		const { device } = this.props
		const { from, to } = this.state
		let startDate = moment(from).format(this.format)
		let endDate = moment(to).format(this.format)
		var data = await getWifiHourly(device.device_id, startDate, endDate).then(rs => rs)
		if (data) {
			var dataArr = Object.keys(data).map(r => ({ id: r, value: data[r] }))
			this.setState({
				loading: false,
				roundDataSets: {
					labels: dataArr.map(rd => rd.id),
					datasets: [{
						borderColor: "#FFF",
						borderWidth: 1,
						data: dataArr.map(rd => rd.value),
						// backgroundColor: dataArr.map(() => getRandomColor())
						backgroundColor: teal[500],
					}]
				},
				barDataSets: {
					labels: dataArr.map(rd => rd.id),
					// data: dataArr.map(rd => rd.value),
					datasets: [{
						borderColor: "#FFF",
						borderWidth: 1,
						data: dataArr.map(rd => rd.value),
						// backgroundColor: dataArr.map(() => getRandomColor())
						backgroundColor: teal[500],
					}]
				}
			})
		}
		else {
			this.setState({
				loading: false,
				roundDataSets: null,
				barDataSets: null
			})
		}
	}

	componentDidMount = async () => {
		this._isMounted = 1
		// console.log(this.props.theme.breakpoints.width("md") < window.innerWidth ? 400 : 1000)
		if (this._isMounted) {
			this.getWifiSum()
		}
	}

	componentWillUnmount = () => {
		this._isMounted = 0
	}

	handleCustomCheckBox = (e) => {
		this.setState({ timeType: parseInt(e.target.value, 10) })
	}
	handleOpenActionsDetails = event => {
		this.setState({ actionAnchor: event.currentTarget });
	}

	handleCloseActionsDetails = () => {
		this.setState({ actionAnchor: null });
	}

	format = "YYYY-MM-DD+HH:mm"
	displayFormat = "DD.MM.YYYY HH:mm"
	handleSwitchDayHour = () => {
		let id = this.state.dateFilterInputID
		switch (id) {
			case 0:
				this.getWifiSum();
				break;
			case 1:
				this.getWifiDay();
				break;
			case 2:
				this.getWifiDay();
				break;
			case 3:
				this.getWifiDay();
				break;
			default:
				this.getWifiDay();
				break;

		}
	}

	handleSetDate = (id) => {
		let to = null
		let from = null
		switch (id) {
			case 0: // Today
				from = moment().startOf('day')
				to = moment().endOf('day')
				break;
			case 1: // Last 7 days
				from = moment().subtract(7, 'd').startOf('day')
				to = moment().endOf('day')
				break;
			case 2: // last 30 days
				from = moment().subtract(30, 'd').startOf('day')
				to = moment().endOf('day')
				break;
			case 3: // last 90 days
				from = moment().subtract(90, 'd').startOf('day')
				to = moment().endOf('day')
				break;
			default:
				break;
		}
		this.setState({
			dateFilterInputID: id,
			to: to,
			from: from,
			loading: true,
			roundDataSets: null,
			barDataSets: null
		}, this.handleSwitchDayHour)
	}

	handleVisibility = (event) => {
		let id = event.target.value
		this.setState({ display: id })
	}

	handleDateFilter = (event) => {
		let id = event.target.value
		if (id !== 4) {
			this.handleSetDate(id)
		}
		else {
			this.setState({ loading: true, openCustomDate: true, dateFilterInputID: id })
		}
	}

	handleCustomDate = date => e => {
		this.setState({
			[date]: e
		})
	}

	options = [
		{ id: 0, label: this.props.t("filters.dateOptions.today") },
		{ id: 1, label: this.props.t("filters.dateOptions.7days") },
		{ id: 2, label: this.props.t("filters.dateOptions.30days") },
		{ id: 3, label: this.props.t("filters.dateOptions.90days") },
		{ id: 4, label: this.props.t("filters.dateOptions.custom") },

	]

	visibilityOptions = [
		{ id: 0, icon: <PieChartRounded />, label: this.props.t("charts.type.pie") },
		{ id: 1, icon: <DonutLargeRounded />, label: this.props.t("charts.type.donut") },
		{ id: 2, icon: <BarChart />, label: this.props.t("charts.type.bar") },
	]

	handleCloseDialog = () => {
		this.setState({ openCustomDate: false })
		if (this.state.timeType === 1) {
			this.getWifiDay()
		}
		else {
			this.getWifiSum()
		}
	}

	renderCustomDateDialog = () => {
		const { classes, t } = this.props
		return <MuiPickersUtilsProvider utils={MomentUtils}>
			<Dialog
				open={this.state.openCustomDate}
				onClose={this.handleCloseUnassign}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description">
				<DialogTitle id="alert-dialog-title">{t("filters.dateOptions.custom")}</DialogTitle>
				<DialogContent>
					<ItemGrid>
						<DateTimePicker
							autoOk
							label={t("filters.startDate")}
							clearable
							format="DD.MM.YYYY+HH:mm"
							value={this.state.from}
							onChange={this.handleCustomDate('from')}
							animateYearScrolling={false}
							color="primary"
							disableFuture
							dateRangeIcon={<DateRange />}
							timeIcon={<AccessTime />}
							rightArrowIcon={<KeyboardArrowRight/>}
							leftArrowIcon={<KeyboardArrowLeft/>}
							InputLabelProps={{ FormLabelClasses: { root: classes.label, focused: classes.focused } }}
							InputProps={{ classes: { underline: classes.underline } }}
						/>
					</ItemGrid>
					<ItemGrid>
						<DateTimePicker
							autoOk
							disableFuture
							label={t("filters.endDate")}
							clearable
							format="DD.MM.YYYY+HH:mm"
							value={this.state.to}
							onChange={this.handleCustomDate('to')}
							animateYearScrolling={false}
							dateRangeIcon={<DateRange />}
							timeIcon={<AccessTime />}
							color="primary"
							rightArrowIcon={<KeyboardArrowRight />}
							leftArrowIcon={<KeyboardArrowLeft/>}
							InputLabelProps={{ FormLabelClasses: { root: classes.label, focused: classes.focused } }}
							InputProps={{ classes: { underline: classes.underline } }}
						/>
					</ItemGrid>
					<ItemGrid container>
						<ItemGrid xs={12} noPadding zeroMargin>
							<Caption>{t("filters.display")}</Caption>
						</ItemGrid>
						<ItemGrid xs={12} zeroMargin>
							<FormControlLabel
								control={
									<Checkbox
										checked={this.state.timeType === 0 ? true : false}
										onChange={this.handleCustomCheckBox}
										value="0"
										className={classes.checkbox}
									/>
								}
								label={t("filters.dateOptions.hourly")}
							/>
						</ItemGrid>
						<ItemGrid xs={12} zeroMargin>
							<FormControlLabel
								control={
									<Checkbox
										checked={this.state.timeType === 1 ? true : false}
										onChange={this.handleCustomCheckBox}
										value="1"
										className={classes.checkbox}
									/>
								}
								label={t("filters.dateOptions.daily")}
							/>
						</ItemGrid>
					</ItemGrid>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => { this.setState({ loading: false, openCustomDate: false }) }} color="primary">
						{t("actions.decline")}
					</Button>
					<Button onClick={this.handleCloseDialog} color="primary" autoFocus>
						{t("actions.apply")}
					</Button>
				</DialogActions>
			</Dialog>
		</MuiPickersUtilsProvider>

	}

	renderNoData = () => {
		return <ItemGrid container justify={'center'}>
			<Caption> {this.props.t("devices.noData")}</Caption>
		</ItemGrid>
	}

	renderType = () => {
		const { display } = this.state
		switch (display) {
			case 0:
				return this.state.roundDataSets ?
					<Pie
						height={this.props.theme.breakpoints.width("md") < window.innerWidth ? 400 : window.innerHeight - 200}
						legend={this.legendOpts}
						data={this.state.roundDataSets}
						options={{
							maintainAspectRatio: false,
						}}
					/> : this.renderNoData()

			case 1:
				return this.state.roundDataSets ?
					<Doughnut
						height={this.props.theme.breakpoints.width("md") < window.innerWidth ? 400 : window.innerHeight - 200}
						legend={this.legendOpts}
						options={{
							maintainAspectRatio: false,
						}}
						data={this.state.roundDataSets}
					/> : this.renderNoData()
			case 2:
				return this.state.barDataSets ? <Bar
					data={this.state.barDataSets}
					legend={this.barOpts}
					height={this.props.theme.breakpoints.width("md") < window.innerWidth ? 700 : window.innerHeight - 200}
					options={{
						maintainAspectRatio: false,
					}}
				/> : this.renderNoData()
			default:
				break;
		}
	}

	renderDateFilter = () => {
		const { classes, t  } = this.props
		const { dateFilterInputID, to, from } = this.state
		let displayTo = moment(to).format(this.displayFormat)
		let displayFrom = moment(from).format(this.displayFormat)
		return (
			<div className={classes.root}>
				<Hidden smDown>
					<DateRange className={classes.leftIcon} />
				</Hidden>
				<FormControl className={classes.formControl}>
					<Select
						value={this.state.dateFilterInputID}
						onChange={this.handleDateFilter}
						inputProps={{
							name: 'data-dateFilter',
							id: 'data-dateFilterInput',
						}}
					>
						<ItemGrid >
							<Caption>{this.options[this.options.findIndex(d => d.id === dateFilterInputID ? true : false)].label}</Caption>
							{/* <Info>{`${from.substr(0, 10)} - ${to.substr(0, 10)}`}</Info> */}
							<Info>{`${displayFrom} - ${displayTo}`}</Info>
						</ItemGrid>
						<Divider />
						<MenuItem value={0}>{t("filters.dateOptions.today")}</MenuItem>
						<MenuItem value={1}>{t("filters.dateOptions.7days")}</MenuItem>
						<MenuItem value={2}>{t("filters.dateOptions.30days")}</MenuItem>
						<MenuItem value={3}>{t("filters.dateOptions.90days")}</MenuItem>
						<Divider />
						<MenuItem value={4}>{t("filters.dateOptions.custom")}</MenuItem>
					</Select>
					<FormHelperText>{`${displayFrom} - ${displayTo}`}</FormHelperText>
				</FormControl>
			</div>
		)
	}

	renderMenu = () => {
		const { actionAnchor } = this.state
		const { classes, t } = this.props
		return <ItemGrid container noMargin noPadding>
			<Hidden smDown>
				{this.renderDateFilter()}
			</Hidden>
			<IconButton
				aria-label="More"
				aria-owns={actionAnchor ? 'long-menu' : null}
				aria-haspopup="true"
				onClick={this.handleOpenActionsDetails}>
				<MoreVert />
			</IconButton>
			<Menu
				id="long-menu"
				anchorEl={actionAnchor}
				open={Boolean(actionAnchor)}
				onClose={this.handleCloseActionsDetails}
				onChange={this.handleVisibility}
				PaperProps={{
					style: {
						maxHeight: 300,
						minWidth: 250
					}
				}}>
				<div>
					<Hidden smUp>
						<ListItem>
							{this.renderDateFilter()}
						</ListItem>
					</Hidden>
				</div>
				<ListItem button onClick={() => { this.setState({ visibility: !this.state.visibility }) }}>
					<ListItemIcon>
						<Visibility />
					</ListItemIcon>
					<ListItemText inset primary={t("filters.options.graphType")} />
					<ExpandMore className={classNames({
						[classes.expandOpen]: this.state.visibility,
					}, classes.expand)} />
				</ListItem>
				<Collapse in={this.state.visibility} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						{this.visibilityOptions.map(op => {
							return <ListItem key={op.id} button className={classes.nested} onClick={() => this.setState({ display: op.id })}>
								<ListItemIcon>
									{op.icon}
								</ListItemIcon>
								<ListItemText inset primary={op.label} />
							</ListItem>
						})}
					</List>
				</Collapse>
				))}
			</Menu>
		</ItemGrid>
	}

	render() {
		const { loading } = this.state
		return (
			<InfoCard
				title={this.props.t("devices.cards.data")} avatar={<AssignmentTurnedIn />}
				noExpand
				topAction={this.renderMenu()}
				content={
					<Grid container>
						{this.renderCustomDateDialog()}
						{loading ? <CircularLoader notCentered /> :
							<Fragment>
								<ItemGrid xs={12} container noPadding>
									{this.renderType()}
								</ItemGrid>
							</Fragment>}
					</Grid>}
			/>
		);
	}
}

DeviceData.propTypes = {
	// history: PropTypes.any.isRequired,
	// match: PropTypes.any.isRequired,
	device: PropTypes.object.isRequired,
}

export default withStyles(deviceStyles, { withTheme: true })(DeviceData);