import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types'
import {
	Grid, IconButton, Menu, MenuItem, withStyles, Select, FormControl, FormHelperText, Divider, ListItem,
	ListItemIcon, ListItemText, Collapse, List, Hidden, Checkbox,
} from '@material-ui/core';
import {
	AssignmentTurnedIn, MoreVert,
	DateRange, DonutLargeRounded, PieChartRounded, BarChart as BarChartIcon, ExpandMore, Visibility, ShowChart
} from "variables/icons"
// import { dateFormatter } from 'variables/functions';
import { ItemGrid, CircularLoader, Caption, Info, ItemG, CustomDateTime, /* , Caption, Info */ } from 'components';
import InfoCard from 'components/Cards/InfoCard';
import deviceStyles from 'assets/jss/views/deviceStyles';
import { /* Doughnut,  */Pie } from 'react-chartjs-2';
import { getDataSummary, getDataDaily, getDataHourly, getDataMinutely, /* getDataHourly */ } from 'variables/dataCollections';
// import { colors } from 'variables/colors';
import classNames from 'classnames';
import { dateTimeFormatter, datesToArr, hoursToArr, minutesToArray } from 'variables/functions';
import { connect } from 'react-redux'
import moment from 'moment'
import LineChart from 'components/Charts/LineChart';
import BarChart from 'components/Charts/BarChart';
import teal from '@material-ui/core/colors/teal'
import DoughnutChart from 'components/Charts/DoughnutChart';

class ProjectData extends PureComponent {
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
			display: 1,
			visibility: false,
			timeType: 2,
			raw: false,
		}
	}
	format = "YYYY-MM-DD+HH:mm"

	displayFormat = "DD MMMM YYYY HH:mm"

	options = [
		{ id: 0, label: this.props.t("filters.dateOptions.today") },
		{ id: 1, label: this.props.t("filters.dateOptions.yesterday") },
		{ id: 2, label: this.props.t("filters.dateOptions.thisWeek") },
		{ id: 3, label: this.props.t("filters.dateOptions.7days") },
		{ id: 4, label: this.props.t("filters.dateOptions.30days") },
		{ id: 5, label: this.props.t("filters.dateOptions.90days") },
		{ id: 6, label: this.props.t("filters.dateOptions.custom") },
	]
	timeTypes = [
		{ id: 0, format: "lll", chart: "minute" },
		{ id: 1, format: "lll", chart: "hour" },
		{ id: 2, format: "ll", chart: "day" },
		{ id: 3, format: "ll", chart: "day" },
	]
	visibilityOptions = [
		{ id: 0, icon: <PieChartRounded />, label: this.props.t("charts.type.pie") },
		{ id: 1, icon: <DonutLargeRounded />, label: this.props.t("charts.type.donut") },
		{ id: 2, icon: <BarChartIcon />, label: this.props.t("charts.type.bar") },
		{ id: 3, icon: <ShowChart />, label: this.props.t("charts.type.line") }
	]
	
	componentDidUpdate = (prevProps) => {
		if (prevProps.hoverID !== this.props.hoverID)
			this.state.timeType === 1 ? this.setHourlyData() :  this.setDailyData()
	}
	setSummaryData = () => {
		const { dataArr, from, to } = this.state
		let displayTo = dateTimeFormatter(to)
		let displayFrom = dateTimeFormatter(from)
		this.setState({
			title: `${displayFrom} - ${displayTo}`,
			loading: false,
			timeType: 3,
			roundDataSets: {
				labels: dataArr.map(d => d.name),
				datasets: [{
					backgroundColor: dataArr.map(d => d.color),
					fill: false,
					data: dataArr.map(d => d.data)
				}]
			}
		})
	}
	setDailyData = () => {
		const { dataArr, from, to } = this.state
		this.setState({
			loading: false,
			timeType: 2,
			lineDataSets: {
				labels: datesToArr(from, to),
				datasets: dataArr.map((d) => ({
					id: d.id,
					backgroundColor: d.color,
					borderColor: d.color,
					borderWidth: this.props.hoverID === d.id ? 8 : 3,
					fill: false,
					label: [d.name],
					data: Object.entries(d.data).map(d => ({ x: d[0], y: d[1] }))
				}))
			},
			barDataSets: {
				labels: datesToArr(from, to),
				datasets: dataArr.map((d) => ({
					id: d.id,
					backgroundColor: d.color,
					borderColor: teal[500],
					borderWidth: this.props.hoverID === d.id ? 4 : 0,
					fill: false,
					label: [d.name],
					data: Object.entries(d.data).map(d => ({ x: d[0], y: d[1] }))
				}))
			},
			roundDataSets: null
		})
	}
	setHourlyData = () => {
		const { dataArr, from, to } = this.state
		this.setState({
			loading: false,
			timeType: 1,
			lineDataSets: {
				labels: hoursToArr(from, to),
				datasets: dataArr.map((d) => ({
					id: d.id,
					backgroundColor: d.color,
					borderColor: d.color,
					borderWidth: this.props.hoverID === d.id ? 8 : 3,
					fill: false,
					label: [d.name],
					data: Object.entries(d.data).map(d => ({ x: d[0], y: d[1] }))
				}))
			},
			barDataSets: {
				labels: hoursToArr(from, to),
				datasets: dataArr.map((d) => ({
					id: d.id,
					backgroundColor: d.color,
					borderColor: d.color,
					borderWidth: this.props.hoverID === d.id ? 4 : 0,
					fill: false,
					label: [d.name],
					data: Object.entries(d.data).map(d => ({ x: d[0], y: d[1] }))
				}))
			},
			roundDataSets: null
		})
	}
	setMinutelyData = () => {
		const { dataArr, from, to } = this.state
		this.setState({
			loading: false,
			timeType: 0,
			lineDataSets: {
				labels: minutesToArray(from, to),
				datasets: dataArr.map((d) => ({
					id: d.id,
					backgroundColor: d.color,
					borderColor: d.color,
					borderWidth: this.props.hoverID === d.id ? 8 : 3,
					fill: false,
					label: [d.name],
					data: Object.entries(d.data).map(d => ({ x: d[0], y: d[1] }))
				})),
				barDataSets: {
					labels: hoursToArr(from, to),
					datasets: dataArr.map((d) => ({
						id: d.id,
						backgroundColor: d.color,
						borderColor: d.color,
						borderWidth: this.props.hoverID === d.id ? 4 : 0,
						fill: false,
						label: [d.name],
						data: Object.entries(d.data).map(d => ({ x: d[0], y: d[1] }))
					}))
				},
				roundDataSets: null
			}
		})
	}

	getWifiHourly = async () => {
		const { project } = this.props
		const { from, to, raw } = this.state
		let startDate = moment(from).format(this.format)
		let endDate = moment(to).format(this.format)
		let dataArr = []
		await Promise.all(project.dataCollections.map(async d => {
			let dataSet = null
			let data = await getDataHourly(d.id, startDate, endDate, raw)
			dataSet = {
				name: d.name,
				id: d.id,
				data: data,
				color: d.color
			}
			return dataArr.push(dataSet)
		}))
		dataArr = dataArr.reduce((newArr, d) => {
			if (d.data !== null)
				newArr.push(d)
			return newArr
		}, [])
		this.setState({ dataArr: dataArr, timeType: 1 }, this.setHourlyData)
	}
	getWifiMinutely = async () => {
		const { project } = this.props
		const { from, to, raw } = this.state
		let startDate = moment(from).format(this.format)
		let endDate = moment(to).format(this.format)
		let dataArr = []
		await Promise.all(project.dataCollections.map(async d => {
			let dataSet = null
			let data = await getDataMinutely(d.id, startDate, endDate, raw)
			dataSet = {
				name: d.name,
				id: d.id,
				data: data,
				color: d.color
			}
			return dataArr.push(dataSet)
		}))
		dataArr = dataArr.reduce((newArr, d) => {
			if (d.data !== null)
				newArr.push(d)
			return newArr
		}, [])
		this.setState({ dataArr: dataArr, timeType: 0 }, this.setMinutelyData)
		// this.setDailyData(dataArr)
	}
	getWifiDaily = async () => {
		const { project } = this.props
		const { from, to, raw } = this.state
		let startDate = moment(from).format(this.format)
		let endDate = moment(to).format(this.format)
		let dataArr = []
		await Promise.all(project.dataCollections.map(async d => {
			let dataSet = null
			let data = await getDataDaily(d.id, startDate, endDate, raw)
			dataSet = {
				name: d.name,
				id: d.id,
				data: data,
				color: d.color
			}
			return dataArr.push(dataSet)
		}))
		dataArr = dataArr.reduce((newArr, d) => {
			if (d.data !== null)
				newArr.push(d)
			return newArr
		}, [])
		this.setState({ dataArr: dataArr, timeType: 2 }, this.setDailyData)
		// this.setDailyData(dataArr)
	}
	getWifiSum = async () => {
		const { project } = this.props
		const { from, to, raw } = this.state
		let startDate = moment(from).format(this.format)
		let endDate = moment(to).format(this.format)
		let dataArr = []
		await Promise.all(project.dataCollections.map(async d => {
			let dataSet = null
			let data = await getDataSummary(d.id, startDate, endDate, raw)
			dataSet = {
				name: d.name,
				id: d.id,
				data: data,
				color: d.color
			}
			return dataArr.push(dataSet)
		}))
		dataArr = dataArr.reduce((newArr, d) => {
			if (d.data !== null)
				newArr.push(d)
			return newArr
		}, [])
		if (dataArr.length > 0)
			this.setState({
				dataArr: dataArr
			}, this.setSummaryData)
		else {
			this.setState({
				dataArr: null,
				noData: true
			})
		}
	}

	componentDidMount = async () => {
		this._isMounted = 1
		if (this._isMounted) {
			this.handleSwitchVisibility()
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
		}, this.handleSwitchVisibility)
	}
	handleSwitchDayHourSummary = () => {
		
		let id = this.state.dateFilterInputID
		const { to, from } = this.state
		let diff = moment.duration(to.diff(from)).days()
		switch (id) {
			case 0:// Today
				this.getWifiHourly();
				break;
			case 1:// Yesterday
				this.getWifiHourly();
				break;
			case 2://this week
				parseInt(diff, 10) > 1 ? this.getWifiDaily() : this.getWifiDaily()
				break;
			case 3:
				this.getWifiDaily();
				break;
			case 4:
				this.getWifiDaily();
				break
			case 5:
				this.getWifiDaily();
				break
			case 6:
				this.customDisplay()
				break
			default:
				this.getWifiDaily();
				break;

		}
	}
	customDisplay = () => {
		
		const { display, timeType } = this.state
		if (display !== 0 || display !== 1) {
			switch (timeType) {
				case 0:
					this.getWifiMinutely()
					break;
				case 1:
					this.getWifiHourly()
					break
				case 2:
					this.getWifiDaily()
					break
				case 3:
					this.getWifiSum()
					break
				default:
					break;
			}
		}
		else { 
			this.getWifiSum()
		}
	}
	handleSwitchVisibility = () => {
		
		const { display } = this.state
		
		switch (display) {
			case 0:
				this.getWifiSum()
				break;
			case 1: 
				this.getWifiSum()
				break
			case 2:
				this.handleSwitchDayHourSummary()
				break
			case 3: 
				this.handleSwitchDayHourSummary()
				break
			default:
				break;
		}
	}
	handleVisibility = id => (event) => {
		if (event)
			event.preventDefault()
		// 
		// let id = event.target.value
		this.setState({ display: id, loading: true }, this.handleSwitchVisibility)
	}

	handleDateFilter = (event) => {
		let id = event.target.value
		if (id !== 6) {
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

	handleCloseDialog = () => {
		this.setState({ openCustomDate: false })
		this.handleSwitchVisibility()
	}

	handleRawData = () => {
		this.setState({ loading: true, actionAnchor: null, raw: !this.state.raw }, () => this.handleSwitchVisibility())
	}

	handleZoomOnData = async (elements) => {
		if (elements.length > 0) {
			const { timeType } = this.state
			let date = null
			let startDate = null
			let endDate = null
			try {
				date = this.state.lineDataSets.datasets[elements[0]._datasetIndex].data[elements[0]._index].x
				switch (timeType) {
					case 1: 
						startDate = moment(date).startOf('hour')
						endDate = moment(date).endOf('hour')
						this.setState({
							from: startDate,
							to: endDate,
							dateFilterInputID: 6
						}, await this.getWifiMinutely)
						break
					case 2:
						startDate = moment(date).startOf('day')
						endDate = moment(date).endOf('day')
						this.setState({
							from: startDate,
							to: endDate,
							dateFilterInputID: 6
						}, await this.getWifiHourly)
						break;
					default:
						break;
				}
			}
			catch (error) {
			}
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
		const { classes, t } = this.props
		const { openCustomDate, to, from, timeType } = this.state
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
	renderType = () => {
		const { display } = this.state
		// const { t } = this.props
		switch (display) {
			case 0:
				return this.state.roundDataSets ? <div style={{ maxHeight: 400 }}>
					<Pie
						height={this.props.theme.breakpoints.width("md") < window.innerWidth ? 400 : window.innerHeight - 200}
						// legend={this.legendOpts}
						data={this.state.roundDataSets}
						options={{
							maintainAspectRatio: false,
						}}
					/>
				</div>
					: this.renderNoData()
			case 1:
				return this.state.roundDataSets ?
					<div style={{ maxHeight: 400 }}>
						<DoughnutChart
							title={this.state.title}
							single //temporary
							unit={this.timeTypes[this.state.timeType]}
							onElementsClick={this.handleZoomOnData}
							setHoverID={this.props.setHoverID}
							data={this.state.roundDataSets}
						/></div>
					: this.renderNoData()
			case 2:
				return this.state.barDataSets ? <div style={{ maxHeight: 400 }}><BarChart
					unit={this.timeTypes[this.state.timeType]}
					onElementsClick={this.handleZoomOnData}
					setHoverID={this.props.setHoverID}
					data={this.state.barDataSets}
					// data={this.state.lineDataSets}
					// legend={this.barOpts}
					// height={this.props.theme.breakpoints.width("md") < window.innerWidth ? window.innerWidth / 4 : window.innerHeight - 200}
					// options={{
					// 	display: true,
					// 	maintainAspectRatio: false,
					// }}
				/></div> : this.renderNoData()
			case 3:
				return this.state.lineDataSets ?
					<LineChart
						unit={this.timeTypes[this.state.timeType]}
						onElementsClick={this.handleZoomOnData}
						setHoverID={this.props.setHoverID}
						data={this.state.lineDataSets}
					/> : this.renderNoData()
			default:
				break;
		}
	}
	renderDateFilter = () => {
		const { classes, t } = this.props
		const { dateFilterInputID, to, from } = this.state
		let displayTo = dateTimeFormatter(to)
		let displayFrom = dateTimeFormatter(from)
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
		const { actionAnchor, actionAnchorVisibility } = this.state
		const { classes, t } = this.props
		return <ItemGrid container noMargin noPadding>
			<ItemG>
				<Hidden smDown>
					{this.renderDateFilter()}
				</Hidden>
			</ItemG>
			<ItemG>
				<Hidden smDown>
					<IconButton title={"Chart Type"} variant={"fab"} onClick={(e) => { this.setState({ actionAnchorVisibility: e.currentTarget }) }}>
						<Visibility />
					</IconButton>
					<Menu
						id="long-menu"
						anchorEl={actionAnchorVisibility}
						open={Boolean(actionAnchorVisibility)}
						onClose={() => this.setState({ actionAnchorVisibility: null })}
						PaperProps={{
							style: {
								// maxHeight: 300,
								minWidth: 250
							}
						}}>					<List component="div" disablePadding>
							{this.visibilityOptions.map(op => {
								return <ListItem key={op.id} value={op.id} button className={classes.nested} onClick={this.handleVisibility(op.id)}>
									<ListItemIcon>
										{op.icon}
									</ListItemIcon>
									<ListItemText inset primary={op.label} />
								</ListItem>
							})}
						</List>
					</Menu>
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
						// maxHeight: 300,
						minWidth: 250
					}
				}}>
				<div>
					<Hidden mdUp>
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
				<div>
					<Hidden mdUp>
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
									return <ListItem key={op.id} button className={classes.nested} onClick={this.handleVisibility(op.id)}>
										<ListItemIcon>
											{op.icon}
										</ListItemIcon>
										<ListItemText inset primary={op.label} />
									</ListItem>
								})}
							</List>
						</Collapse>
					</Hidden>
				</div>
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
								<ItemG xs={12}>
									<Caption className={classes.bigCaption2}>{raw ? t("collections.rawData") : t("collections.calibratedData")}</Caption>
									{noData ? this.renderNoData() : this.renderType()}
								</ItemG>
								{/* {this.props.hoverID} */}
							</Fragment>}
					</Grid>}
			/>
		);
	}
}
ProjectData.propTypes = {
	project: PropTypes.object.isRequired,
}
const mapStateToProps = (state) => ({
	chartType: state.settings.chartType
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(deviceStyles, { withTheme: true })(ProjectData))