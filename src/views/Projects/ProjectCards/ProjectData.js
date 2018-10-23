import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types'
import { Grid, IconButton, Menu, MenuItem, withStyles, /* Typography, */ Select, FormControl, FormHelperText, Divider, Dialog, DialogTitle, DialogContent, /* DialogContentText, */ Button, DialogActions, ListItem, ListItemIcon, ListItemText, Collapse, List, Hidden, Checkbox } from '@material-ui/core';
import {
	AccessTime, AssignmentTurnedIn, MoreVert,
	DateRange, KeyboardArrowRight as KeyArrRight, KeyboardArrowLeft as KeyArrLeft,
	DonutLargeRounded, PieChartRounded, BarChart, ExpandMore, Visibility, ShowChart
} from "@material-ui/icons"
// import { dateFormatter } from 'variables/functions';
import { ItemGrid, CircularLoader, Caption, Info, ItemG, /* , Caption, Info */ } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import deviceStyles from 'assets/jss/views/deviceStyles';
import { Doughnut, Bar, Pie, Line  } from 'react-chartjs-2';
import { getDataSummary, getDataDaily, /* getDataHourly */ } from 'variables/dataCollections';
import { colors } from 'variables/colors';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import classNames from 'classnames';
import { dateFormatter } from 'variables/functions';
var moment = require('moment');

// options: {
// 	title: {
// 		display: true,
// 			text: 'Chart.js Bar Chart - Stacked'
// 	},
// 	tooltips: {
// 		mode: 'index',
// 			intersect: false
// 	},
// 	responsive: true,
// 		scales: {
// 		xAxes: [{
// 			stacked: true,
// 		}],
// 			yAxes: [{
// 				stacked: true
// 			}]
// 	}
// }


class ProjectData extends Component {
	constructor(props) {
		super(props)

		this.state = {
			from: moment().subtract(7, 'd').startOf('day'),
			to: moment().endOf('day'),
			barDataSets: null,
			roundDataSets: null,
			actionAnchor: null,
			loading: true,
			dateFilterInputID: 3,
			openCustomDate: false,
			display: 3,
			visibility: false,
			raw: false
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
	options = [
		{ id: 0, label: this.props.t("filters.dateOptions.today") },
		{ id: 1, label: this.props.t("filters.dateOptions.yesterday") },
		{ id: 2, label: this.props.t("filters.dateOptions.thisWeek") },
		{ id: 3, label: this.props.t("filters.dateOptions.7days") },
		{ id: 4, label: this.props.t("filters.dateOptions.30days") },
		{ id: 5, label: this.props.t("filters.dateOptions.90days") },
		{ id: 6, label: this.props.t("filters.dateOptions.custom") },
	]

	visibilityOptions = [
		{ id: 0, icon: <PieChartRounded />, label: this.props.t("charts.type.pie") },
		{ id: 1, icon: <DonutLargeRounded />, label: this.props.t("charts.type.donut") },
		{ id: 2, icon: <BarChart />, label: this.props.t("charts.type.bar") },
		{ id: 3, icon: <ShowChart />, label: this.props.t("charts.type.line") }
	] 
	datesToArr = () => {
		const { from, to } = this.state
		let startDate = moment(from)
		let endDate = moment(to)
		let arr = []
		let d = startDate.clone()
		while (d <= endDate) {
			arr.push(d)
			d = d.clone().add(1, 'd')
		}
		return arr
	}
	getWifiDaily = async () => {
		const { project } = this.props
		const { from, to, raw } = this.state
		let startDate = moment(from).format(this.format)
		let endDate = moment(to).format(this.format)
		let days = this.datesToArr()
		// console.log(days);
		
		let dataArr = []

		await Promise.all(project.dataCollections.map(async d => {
			let dataSet = null
			let data = await getDataDaily(d.id, startDate, endDate, raw)
			dataSet = {
				name: d.name,
				id: d.id,
				data: data
			}
			return dataArr.push(dataSet)
		}))
		// console.log(dataArr, dataArr.length);
		
		// if (dataArr.length > 0)
		this.setState({
			loading: false,
			lineDataSets: {
				labels: days.map(d => dateFormatter(d)),
				datasets: dataArr.map((d, id) => ({
					borderColor: colors[id],
					// borderWidth: 1,
					label: d.name,
					data: Object.keys(d.data).map(data => parseInt(d.data[data], 10)),
					backgroundColor: colors[18],
					fill: false,
					lineTension: 0.1,
					borderCapStyle: 'butt',
					borderJoinStyle: 'miter',
					pointBorderColor: colors[18]
				}))
			},
			roundDataSets: {
				labels: days.map(d => dateFormatter(d)),
				datasets: dataArr.map((d, id) => ({
					label: d.name,
					borderColor: "#FFF",
					borderWidth: 1,
					data: Object.keys(d.data).map(data => parseInt(d.data[data], 10)),
					backgroundColor: colors[id]
				}))
			},
			barDataSets: {
				labels: days.map(d => dateFormatter(d)),
				datasets: dataArr.map((d, id) => ({
					label: d.name,
					borderColor: "#FFF",
					borderWidth: 1,
					data: Object.keys(d.data).map(data => parseInt(d.data[data], 10)),
					backgroundColor: colors[id]
				}))
			}
		})

	}
	getWifiSum = async () => {
		const { project } = this.props
		const { from, to, raw } = this.state
		let startDate = moment(from).format(this.format)
		let endDate = moment(to).format(this.format)

		let dataArr = []
		await Promise.all(project.dataCollections.map(async d => {
			let dataSet = null
			let rs = await getDataSummary(d.id, startDate, endDate, raw)
			let total = 0
			Object.keys(rs).map(r => total = total + parseInt(rs[r], 10))
			// console.log(total);
			dataSet = { nr: d.id, id: d.name + "(" + d.id + ")", data: total }
			return dataArr.push(dataSet)
		}))
		dataArr.sort((a, b) => a.nr - b.nr)
		// console.log(dataArr.map((d, id) => ({
		// 	borderColor: "#FFF",
		// 	borderWidth: 1,
		// 	data: parseInt(d.data, 10),
		// 	backgroundColor: colors[id]
		// })))
		if (dataArr.length > 0)
			this.setState({
				loading: false,
				roundDataSets: {
					labels: dataArr.map(da => da.id),
					datasets: [{
						borderColor: "#FFF",
						borderWidth: 1,
						data: dataArr.map(d => parseInt(d.data, 10)),
						backgroundColor: dataArr.map((rd, id) => colors[id])
					}]
				},
				barDataSets: {
					labels: [this.options[this.state.dateFilterInputID].label],
					datasets: dataArr.map((d, id) => ({
						label: d.id,
						borderColor: "#FFF",
						borderWidth: 1,
						data: [parseInt(d.data, 10)],
						backgroundColor: colors[id]
					}))
				}
			})
		else { 
			this.setState({
				loading: false,
				noData: true
			})
		}
	}
	componentDidMount = async () => {
		this._isMounted = 1
		if (this._isMounted) {
			this.getWifiDaily()
		}
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}

	handleOpenActionsDetails = event => {
		this.setState({ actionAnchor: event.currentTarget });
	}

	handleCloseActionsDetails = () => {
		this.setState({ actionAnchor: null });
	}

	format = "YYYY-MM-DD+HH:mm"
	displayFormat = "DD MMMM YYYY HH:mm"
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
		}, this.getWifiDaily)
	}
	handleVisibility = (event) => {
		let id = event.target.value
		this.setState({ display: id })
	}
	
	handleDateFilter = (event) => {
		let id = event.target.value
		if (id !== 6) {
			this.handleSetDate(id)
		}
		else { 
			this.setState({ loading: true,  openCustomDate: true, dateFilterInputID: id })
		}
	}
	
	handleCustomDate = date => e => {
		this.setState({
			[date]: e
		})
	}

	handleCloseDialog = () => {
		this.setState({ openCustomDate: false })
		this.getWifiSum()
	}

	handleRawData = () => { 
		this.setState({ loading: true, actionAnchor: null, raw: !this.state.raw }, () => this.getWifiSum())
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
							ampm={false}
							format="LLL"
							value={this.state.from}
							onChange={this.handleCustomDate('from')}
							animateYearScrolling={false}
							color="primary"
							disableFuture
							dateRangeIcon={<DateRange />}
							timeIcon={<AccessTime/>}
							rightArrowIcon={<KeyArrRight />}
							leftArrowIcon={<KeyArrLeft />}
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
							ampm={false}
							format="LLL"
							value={this.state.to}
							onChange={this.handleCustomDate('to')}
							animateYearScrolling={false}
							dateRangeIcon={<DateRange />}
							timeIcon={<AccessTime />}
							color="primary"
							rightArrowIcon={<KeyArrRight />}
							leftArrowIcon={<KeyArrLeft />}
							InputLabelProps={{ FormLabelClasses: { root: classes.label, focused: classes.focused } }}
							InputProps={{ classes: { underline: classes.underline } }}
						/>
					</ItemGrid>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => { this.setState({ loading: false, openCustomDate: false })}} color="primary">
						{t("dialogs.cancel")}
					</Button>
					<Button onClick={this.handleCloseDialog} color="primary" autoFocus>
						{t("dialogs.apply")}
					</Button>
				</DialogActions>
			</Dialog>
		</MuiPickersUtilsProvider>

	}
	renderType = () => {
		const { display } = this.state
		// const { t } = this.props
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
					/>
					: this.renderNoData()
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
					height={this.props.theme.breakpoints.width("md") < window.innerWidth ? window.innerWidth / 4 : window.innerHeight - 200}
					options={{
						display: true,
						// title: { display: true, text: raw ? t("collections.rawData") : t("collections.calibratedData") },
						maintainAspectRatio: false,
						// scales: {
						// 	xAxes: [{
						// 		stacked: true,
						// 	}],
						// 	yAxes: [{
						// 		stacked: true
						// 	}]
						// }
					}}
				/> : this.renderNoData()
			case 3: 
				return this.state.lineDataSets ? <Line 
					data={this.state.lineDataSets}
					legend={this.barOpts}
					height={this.props.theme.breakpoints.width("md") < window.innerWidth ? window.innerWidth / 4 : window.innerHeight - 200}
					options={{
						display: true,
						maintainAspectRatio: false,
					}}
				/> : this.renderNoData()
			default:
				break;
		}
	}
	renderDateFilter = () => {
		const { classes, t } = this.props
		const { dateFilterInputID, to, from } = this.state
		let displayTo = dateFormatter(to)
		let displayFrom = dateFormatter(from)
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
						<MenuItem value={1}>{t("filters.dateOptions.yesterday")}</MenuItem>
						<MenuItem value={2}>{t("filters.dateOptions.thisWeek")}</MenuItem>
						<MenuItem value={3}>{t("filters.dateOptions.7days")}</MenuItem>
						<MenuItem value={4}>{t("filters.dateOptions.30days")}</MenuItem>
						<MenuItem value={5}>{t("filters.dateOptions.90days")}</MenuItem>
						<Divider />
						<MenuItem value={6}>{t("filters.dateOptions.custom")}</MenuItem>
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
				<ListItem button onClick={() => this.handleRawData()}>
					<ListItemIcon>
						<Checkbox
							checked={this.state.raw}
							// disabled
							className={classes.noPadding}
						/>
					</ListItemIcon>
					<ListItemText>
						{t("collections.rawData")}
					</ListItemText>
				</ListItem>
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
	renderNoData = () => {
		return <ItemG container justify={'center'}>
			<Caption> {this.props.t("devices.noData")}</Caption>
		</ItemG>
	}

	render() {
		const { t, classes } = this.props
		const { loading, noData, raw } = this.state
		return (
			<InfoCard
				title={t("projects.infoCardProjectData")} avatar={<AssignmentTurnedIn />}
				noExpand
				// noPadding
				topAction={noData ? null : this.renderMenu()}
				content={
					<Grid container>
						{this.renderCustomDateDialog()}
						{loading ? <CircularLoader notCentered /> :
							<Fragment>
								<ItemG xs={12} container>
									<Caption className={classes.bigCaption2}>{raw ? t("collections.rawData") : t("collections.calibratedData")}</Caption>
									{noData ? this.renderNoData() : this.renderType()}
								</ItemG>
							</Fragment>}
					</Grid>}
			/>
		);
	}
}
ProjectData.propTypes = {
	project: PropTypes.object.isRequired,
}
export default withStyles(deviceStyles, { withTheme: true })(ProjectData);