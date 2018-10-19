import { Collapse, Divider, FormControl, FormHelperText, Grid, Hidden, IconButton, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Select, withStyles } from '@material-ui/core';
import { AssignmentTurnedIn, BarChart, DateRange, DonutLargeRounded, ExpandMore, MoreVert, PieChartRounded, Visibility } from "@material-ui/icons";
import deviceStyles from 'assets/jss/views/deviceStyles';
import classNames from 'classnames';
import { Caption, CircularLoader, CustomDateTime, Info, InfoCard, ItemG, ItemGrid } from 'components';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import { colors } from 'variables/colors';
import { getWifiDaily, getWifiHourly } from 'variables/dataDevices';
import { shortDateFormat } from 'variables/functions';

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
		display: this.props.theme.breakpoints.width("md") < window.innerWidth ? true : true,
		position: this.props.theme.breakpoints.width("md") < window.innerWidth ? 'left' : "bottom",
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
		let data = await getWifiDaily(device.id, startDate, endDate).then(rs => rs)
		if (data) {
			let dataArr = Object.keys(data).map(r => ({ id: shortDateFormat(r), value: data[r] }))
			this.setState({
				loading: false,
				calibrated: {
					roundDataSets: {
						labels: dataArr.map(rd => rd.id),
						datasets: [{
							borderColor: "#FFF",
							borderWidth: 1,
							data: dataArr.map(rd => device.wifiFactor ? parseInt(rd.value, 10) * device.wifiFactor : parseInt(rd.value, 10)),
							// backgroundColor: dataArr.map(() => getRandomColor())
							backgroundColor: dataArr.map((rd, id) => colors[id])
						}]
					},
					barDataSets: {
						labels: dataArr.map(rd => rd.id),
						datasets: [{
							borderColor: "#FFF",
							borderWidth: 1,
							data: dataArr.map(rd => device.wifiFactor ? parseInt(rd.value, 10) * device.wifiFactor : parseInt(rd.value, 10)),
							backgroundColor: dataArr.map((rd, id) => colors[id])
						}
						]
					}
				},
				uncalibrated: {

					roundDataSets: {
						labels: dataArr.map(rd => rd.id),
						datasets: [{
							borderColor: "#FFF",
							borderWidth: 1,
							data: dataArr.map(rd => rd.value),
							// backgroundColor: dataArr.map(() => getRandomColor())
							backgroundColor: dataArr.map((rd, id) => colors[id])
						}]
					},
					barDataSets: {
						labels: dataArr.map(rd => rd.id),
						datasets: [{
							borderColor: "#FFF",
							borderWidth: 1,
							data: dataArr.map(rd => rd.value),
							backgroundColor: dataArr.map((rd, id) => colors[id])
						}
						]
					}
				}
			})
		}
		else {
			this.setState({
				loading: false,
				calibrated: {
					roundDataSets: null,
					barDataSets: null,
				}
			})
		}
	}

	getWifiSum = async () => {
		const { device } = this.props
		const { from, to } = this.state
		let startDate = moment(from).format(this.format)
		let endDate = moment(to).format(this.format)
		var data = await getWifiHourly(device.id, startDate, endDate).then(rs => rs)
		if (data) {
			var dataArr = Object.keys(data).map(r => ({ id: moment(r).format("HH:mm"), value: data[r] }))
			this.setState({
				loading: false,
				calibrated: {
					roundDataSets: {
						labels: dataArr.map(rd => rd.id),
						datasets: [{
							borderColor: "#FFF",
							borderWidth: 1,
							data: dataArr.map(rd => device.wifiFactor ? parseInt(rd.value, 10) * device.wifiFactor : parseInt(rd.value, 10)),
							// backgroundColor: dataArr.map(() => getRandomColor())
							backgroundColor: dataArr.map((rd, id) => colors[id])
						}]
					},
					barDataSets: {
						labels: dataArr.map(rd => rd.id),
						datasets: [{
							borderColor: "#FFF",
							borderWidth: 1,
							data: dataArr.map(rd => device.wifiFactor ? parseInt(rd.value, 10) * device.wifiFactor : parseInt(rd.value, 10)),
							backgroundColor: dataArr.map((rd, id) => colors[id])
						}
						]
					}
				},
				uncalibrated: {

					roundDataSets: {
						labels: dataArr.map(rd => rd.id),
						datasets: [{
							borderColor: "#FFF",
							borderWidth: 1,
							data: dataArr.map(rd => rd.value),
							// backgroundColor: dataArr.map(() => getRandomColor())
							backgroundColor: dataArr.map((rd, id) => colors[id])
						}]
					},
					barDataSets: {
						labels: dataArr.map(rd => rd.id),
						datasets: [{
							borderColor: "#FFF",
							borderWidth: 1,
							data: dataArr.map(rd => rd.value),
							backgroundColor: dataArr.map((rd, id) => colors[id])
						}
						]
					}
				}
			})
		}
		else {
			this.setState({
				loading: false,
				roundDataSets: null,
				barDataSets: null,
			})
		}
	}

	componentDidMount = async () => {
		this._isMounted = 1
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

	handleSwitchDayHour = () => {
		let id = this.state.dateFilterInputID
		switch (id) {
			case 0://
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
			case 5:
				this.getWifiSum();
				break
			case 6:
				this.getWifiDay();
				break
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
			case 5: // Yesterday
				from = moment().subtract(1, 'd').startOf('day')
				to = moment().subtract(1, 'd').endOf('day')
				break;
			case 6: //This Week
				from = moment().startOf('week').startOf('day')
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
		{ id: 5, label: this.props.t("filters.dateOptions.yesterday") },
		{ id: 6, label: this.props.t("filters.dateOptions.thisWeek") },
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
    handleCancelCustomDate = () => {
    	this.setState({
    		loading: false, openCustomDate: false
    	})
    }
	renderCustomDateDialog = () => {
		const { classes, t } = this.props
		const { openCustomDate, to, from, timeType } = this.state
		return <CustomDateTime
			openCustomDate={openCustomDate}
			handleCloseDialog={this.handleCloseDialog}
			handleCustomDate={this.handleCustomDate}
			to={to}
			from={from}
			timeType={timeType}
			handleCustomCheckBox={this.handleCustomCheckBox}
			handleCancelCustomDate={this.handleCancelCustomDate}
			t={t}
			classes={classes}
		/>
	}

	renderNoDataFilters = () => {
		return <ItemGrid container justify={'center'}>
			<Caption> {this.props.t("devices.noDataFilters")}</Caption>
		</ItemGrid>
	}

	renderType = () => {
		const { display } = this.state
		const { classes } = this.props
		switch (display) {
			case 0:
				return this.state.calibrated.roundDataSets ? <ItemG container>
					<ItemG xs={12}>
						<Caption className={classes.bigCaption2}>Calibrated Data</Caption>
						<Pie
							height={this.props.theme.breakpoints.width("md") < window.innerWidth ? 400 : window.innerHeight - 200}
							legend={this.legendOpts}
							data={this.state.calibrated.roundDataSets}
							options={{
								maintainAspectRatio: false,
							}}
						/>
					</ItemG>
					<ItemG xs={12}>
						<Caption className={classes.bigCaption2}>Raw Data</Caption>
						<Pie
							height={this.props.theme.breakpoints.width("md") < window.innerWidth ? 400 : window.innerHeight - 200}
							legend={this.legendOpts}
							data={this.state.uncalibrated.roundDataSets}
							options={{
								maintainAspectRatio: false,
							}}
						/>
					</ItemG>
				</ItemG> : this.renderNoDataFilters()

			case 1:
				return this.state.calibrated ? this.state.calibrated.roundDataSets ? <ItemG container>
					<ItemG xs={12}>
						<Caption className={classes.bigCaption2}>Calibrated Data</Caption>
						<Doughnut
							height={this.props.theme.breakpoints.width("md") < window.innerWidth ? 400 : window.innerHeight - 200}
							legend={this.legendOpts}
							options={{
								maintainAspectRatio: false,
							}}
							data={this.state.calibrated.roundDataSets}
						/>	</ItemG>
					<ItemG xs={12}>
						<Caption className={classes.bigCaption2}>Raw Data</Caption>
						<Doughnut
							height={this.props.theme.breakpoints.width("md") < window.innerWidth ? 400 : window.innerHeight - 200}
							legend={this.legendOpts}
							options={{
								maintainAspectRatio: false,
							}}
							data={this.state.uncalibrated.roundDataSets}
						/></ItemG>
				</ItemG> : this.renderNoDataFilters() : this.renderNoDataFilters()
			case 2:
				return this.state.calibrated ? this.state.calibrated.barDataSets ? <ItemG container>
					<ItemG xs={12}>
						<Caption className={classes.bigCaption2}>Calibrated Data</Caption>
						<Bar
							data={this.state.calibrated.barDataSets}
							legend={this.barOpts}
							height={this.props.theme.breakpoints.width("md") < window.innerWidth ? window.innerHeight / 4 : window.innerHeight - 200}
							options={{
								maintainAspectRatio: false,
							}}
						/>
					</ItemG>
					<ItemG xs={12}>
						<Caption className={classes.bigCaption1}>Raw Data</Caption>
						<Bar
							data={this.state.uncalibrated.barDataSets}
							legend={this.barOpts}
							height={this.props.theme.breakpoints.width("md") < window.innerWidth ? window.innerHeight / 4 : window.innerHeight - 200}
							options={{
								maintainAspectRatio: false,
							}}
						/>
					</ItemG>
				</ItemG> : this.renderNoDataFilters() : this.renderNoDataFilters()


			default:
				break;
		}
	}

	renderDateFilter = () => {
		const { classes, t } = this.props
		const { dateFilterInputID, to, from } = this.state
		let displayTo = shortDateFormat(to)
		let displayFrom = shortDateFormat(from)
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
						<MenuItem value={5}>{t("filters.dateOptions.yesterday")}</MenuItem>
						<MenuItem value={6}>{t("filters.dateOptions.thisWeek")}</MenuItem>
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
			<ItemG>
				<Hidden smDown>
					{this.renderDateFilter()}
				</Hidden>
			</ItemG>
			<ItemG>
				<IconButton
					aria-label="More"
					aria-owns={actionAnchor ? 'long-menu' : null}
					aria-haspopup="true"
					onClick={this.handleOpenActionsDetails}>
					<MoreVert />
				</IconButton>
			</ItemG>
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
					<Hidden lgUp>
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
		const { t } = this.props
		return (
			<InfoCard
				title={t("devices.cards.data")} avatar={<AssignmentTurnedIn />}
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